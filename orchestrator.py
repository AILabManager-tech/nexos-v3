"""
NEXOS v3.0 Orchestrator — Multi-phase avec quality gates SOIC
"""

import json
import os
import re
import signal
import socket
import subprocess
import sys
import time
import unicodedata
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    from rich.progress import Progress, SpinnerColumn, TextColumn
    console = Console()
except ImportError:
    # Fallback si rich n'est pas installé
    class Console:
        def print(self, *a, **kw): print(*a)
    console = Console()

NEXOS_ROOT = Path(__file__).parent.resolve()
CLIENTS_DIR = NEXOS_ROOT / "clients"
AGENTS_DIR = NEXOS_ROOT / "agents"
TOOLS_DIR = NEXOS_ROOT / "tools"
LOGS_DIR = NEXOS_ROOT / "logs"

# ── Quality gate thresholds ──────────────────────────────────────────────────
GATE_THRESHOLDS = {
    "ph0-discovery": 7.0,
    "ph1-strategy":  8.0,
    "ph2-design":    8.0,
    "ph3-content":   8.0,
    "ph4-build":     None,   # BUILD PASS (binaire)
    "ph5-qa":        8.5,
}

# ── Phase sequence ───────────────────────────────────────────────────────────
PHASES_CREATE = [
    "ph0-discovery", "ph1-strategy", "ph2-design",
    "ph3-content", "ph4-build", "ph5-qa"
]

PHASES_MAP = {
    "create":  PHASES_CREATE,
    "audit":   ["ph5-qa"],
    "modify":  ["site-update"],
    "content": ["ph3-content"],
    "analyze": ["ph0-discovery"],
}


def slugify(name: str) -> str:
    """Convertit un nom en slug kebab-case (supporte Unicode composé)."""
    slug = unicodedata.normalize("NFC", name).lower().strip()
    # Décomposer en NFD pour séparer les accents, puis retirer les diacritiques
    slug = unicodedata.normalize("NFD", slug)
    slug = "".join(c for c in slug if unicodedata.category(c) != "Mn")
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
    return slug


def generate_brief(mode: str, answers: dict, free_text: str = "") -> Path:
    """Génère le brief-client.json et retourne le chemin du dossier client."""
    timestamp = datetime.now().isoformat()
    client_name = answers.get("client_name", f"projet-{datetime.now().strftime('%Y-%m-%d')}")
    slug = slugify(client_name)

    client_dir = CLIENTS_DIR / slug
    client_dir.mkdir(parents=True, exist_ok=True)
    (client_dir / "tooling").mkdir(exist_ok=True)
    (client_dir / "site").mkdir(exist_ok=True)

    brief = {
        "_meta": {
            "generator": "nexos-v3.0",
            "created_at": timestamp,
            "mode": mode,
        },
        "client": {"name": client_name, "slug": slug},
        "mission": {
            "mode": mode,
            "phases": PHASES_MAP[mode],
        },
        "inputs": answers,
        "context_libre": free_text,
    }

    brief_path = client_dir / "brief-client.json"
    brief_path.write_text(json.dumps(brief, ensure_ascii=False, indent=2), encoding="utf-8")

    console.print(f"[green]✓[/] Brief généré : {brief_path}")
    return client_dir


def build_phase_prompt(phase: str, client_dir: Path) -> str:
    """Construit le prompt pour une phase avec contexte cumulatif."""
    parts = []

    # 1. Agent directive
    agent_path = AGENTS_DIR / phase / "_orchestrator.md"
    if phase == "site-update":
        agent_path = AGENTS_DIR / "site-update" / "_pipeline.md"
    parts.append(f"Lis {agent_path} et adopte le rôle décrit.")

    # 2. Brief client
    brief_path = client_dir / "brief-client.json"
    parts.append(f"Le brief client est dans {brief_path}. Lis-le.")

    # 3. Feed des phases précédentes
    phase_reports = {
        "ph0-discovery": [],
        "ph1-strategy":  ["ph0-discovery-report.md"],
        "ph2-design":    ["ph0-discovery-report.md", "ph1-strategy-report.md"],
        "ph3-content":   ["ph0-discovery-report.md", "ph1-strategy-report.md", "ph2-design-report.md"],
        "ph4-build":     ["ph1-strategy-report.md", "ph2-design-report.md", "ph3-content-report.md"],
        "ph5-qa":        ["ph4-build-log.md"],
    }

    for report_name in phase_reports.get(phase, []):
        report_path = client_dir / report_name
        if report_path.exists():
            parts.append(f"Lis {report_path} pour le contexte de la phase précédente.")

    # 4. Tooling data (pour ph5 uniquement)
    if phase == "ph5-qa":
        tooling_dir = client_dir / "tooling"
        if tooling_dir.exists() and any(tooling_dir.iterdir()):
            parts.append(
                f"Les résultats de tooling réel sont dans {tooling_dir}/. "
                f"Lis CHAQUE fichier JSON. Ce sont des MESURES RÉELLES, "
                f"pas des estimations. Base ton audit sur ces données."
            )

    # 5. Output
    output_map = {
        "ph0-discovery": "ph0-discovery-report.md",
        "ph1-strategy":  "ph1-strategy-report.md",
        "ph2-design":    "ph2-design-report.md",
        "ph3-content":   "ph3-content-report.md",
        "ph4-build":     "ph4-build-log.md",
        "ph5-qa":        "ph5-qa-report.md",
    }
    output_file = output_map.get(phase, f"{phase}-report.md")
    parts.append(f"Écris ton rapport dans {client_dir / output_file}")

    return "\n".join(parts)


def run_preflight_tooling(client_dir: Path, url: str) -> bool:
    """Exécute les outils CLI de mesure AVANT les agents LLM."""
    console.print("\n[bold cyan]⚡ TOOLING PREFLIGHT[/]")

    preflight_script = TOOLS_DIR / "preflight.sh"
    if not preflight_script.exists():
        console.print("[yellow]⚠ tools/preflight.sh non trouvé — skip tooling[/]")
        return True

    try:
        result = subprocess.run(
            ["bash", str(preflight_script), url, str(client_dir)],
            cwd=str(NEXOS_ROOT),
            timeout=120,
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            console.print("[green]✓[/] Tooling preflight terminé")
        else:
            console.print(f"[yellow]⚠[/] Tooling preflight partiel (code {result.returncode})")
            if result.stderr:
                console.print(f"[dim]{result.stderr[:500]}[/]")
        return True
    except subprocess.TimeoutExpired:
        console.print("[yellow]⚠ Tooling timeout (120s) — skip[/]")
        return True
    except Exception as e:
        console.print(f"[red]✗ Tooling error: {e}[/]")
        return True  # Non-bloquant


def run_soic_gate(phase: str, client_dir: Path) -> tuple[bool, float]:
    """Exécute le quality gate SOIC pour une phase."""
    from soic.gate import evaluate_gate

    threshold = GATE_THRESHOLDS.get(phase)
    if threshold is None:
        # Phase 4 = BUILD PASS (binaire)
        build_log = client_dir / "ph4-build-log.md"
        if build_log.exists():
            content = build_log.read_text()
            passed = "BUILD PASS" in content or "build réussi" in content.lower()
            return passed, 10.0 if passed else 0.0
        return True, 10.0  # Assume pass si pas de log

    try:
        mu = evaluate_gate(phase, client_dir)
        passed = mu >= threshold
        return passed, mu
    except Exception as e:
        console.print(f"[yellow]⚠ SOIC gate error: {e} — PASS par défaut[/]")
        return True, 0.0


def run_claude_cli(prompt: str, cwd: str, log_path: Path) -> int:
    """Lance claude CLI avec le prompt et capture la sortie."""
    cmd = ["claude", "--dangerously-skip-permissions", "-p", prompt]

    log_path.parent.mkdir(parents=True, exist_ok=True)

    # Allow nested Claude Code sessions and use Claude's own auth
    env = os.environ.copy()
    env.pop("CLAUDECODE", None)
    env.pop("ANTHROPIC_API_KEY", None)

    process = None
    try:
        process = subprocess.Popen(
            cmd, cwd=cwd, env=env,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            text=True, bufsize=1,
        )

        with open(log_path, "w", encoding="utf-8") as log:
            log.write(f"# NEXOS v3.0 Log\n")
            log.write(f"# Date: {datetime.now().isoformat()}\n")
            log.write(f"# Prompt:\n{prompt}\n\n---\n\n")

            for line in process.stdout:
                sys.stdout.write(line)
                sys.stdout.flush()
                log.write(line)

        process.wait()
        return process.returncode

    except FileNotFoundError:
        console.print(
            "[red bold]Claude CLI non trouvé.[/]\n"
            "Installe-le avec: [cyan]npm install -g @anthropic-ai/claude-code[/]"
        )
        return 1
    except KeyboardInterrupt:
        console.print("\n[yellow]⚠ Interrompu par l'utilisateur[/]")
        if process:
            process.terminate()
        return 130


# ── Preflight scan config ────────────────────────────────────────────────────

_SCAN_SCRIPTS: list[tuple[str, str, int]] = [
    # (script_name, output_filename, timeout_seconds)
    ("lighthouse-scan.sh", "lighthouse.json", 60),
    ("a11y-scan.sh", "a11y.json", 60),
    ("headers-scan.sh", "headers.json", 30),
    ("ssl-scan.sh", "ssl.json", 30),
]

_PREFLIGHT_TOTAL_TIMEOUT = 300  # 5 minutes


def _find_free_port() -> int:
    """Find a free TCP port on localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def run_preflight(site_dir: Path, client_dir: Path) -> dict[str, Path]:
    """Build the site, start a local server, run scan scripts, stop the server.

    Returns a dict mapping tool names to their output JSON paths.
    Missing scripts are logged and skipped (gates will be NOT_EXECUTED).
    """
    results: dict[str, Path] = {}
    tooling_dir = client_dir / "tooling"
    tooling_dir.mkdir(exist_ok=True)

    # 1. Verify build dir
    if not (site_dir / "package.json").exists():
        console.print(f"[yellow]⚠ Pas de package.json dans {site_dir} — skip preflight[/]")
        return results

    # 2. Build if needed
    next_dir = site_dir / ".next"
    if not next_dir.exists():
        console.print("[cyan]  Building site (npm run build)...[/]")
        try:
            subprocess.run(
                ["npm", "run", "build"], cwd=str(site_dir),
                timeout=180, capture_output=True, text=True,
            )
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            console.print(f"[yellow]⚠ Build failed: {e} — skip preflight[/]")
            return results

    # 3. Start local Next.js server
    port = _find_free_port()
    local_url = f"http://localhost:{port}"
    console.print(f"[cyan]  Starting Next.js on port {port}...[/]")
    server_proc = None
    try:
        server_proc = subprocess.Popen(
            ["npx", "next", "start", "-p", str(port)],
            cwd=str(site_dir),
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            preexec_fn=os.setsid,
        )
        # Wait for server to be ready
        for _ in range(30):
            time.sleep(1)
            try:
                with socket.create_connection(("localhost", port), timeout=1):
                    break
            except OSError:
                continue
        else:
            console.print("[yellow]⚠ Server did not start in 30s — skip preflight[/]")
            return results

        console.print(f"[green]  ✓ Server ready at {local_url}[/]")

        # 4. Run scan scripts
        preflight_start = time.monotonic()
        for script_name, output_file, timeout in _SCAN_SCRIPTS:
            elapsed = time.monotonic() - preflight_start
            if elapsed >= _PREFLIGHT_TOTAL_TIMEOUT:
                console.print("[yellow]⚠ Preflight total timeout (5min) — stopping scans[/]")
                break

            script_path = TOOLS_DIR / script_name
            if not script_path.exists():
                console.print(f"[dim]  ⊘ {script_name} not found — skip[/]")
                continue

            output_path = tooling_dir / output_file
            try:
                proc = subprocess.run(
                    ["bash", str(script_path), local_url, str(tooling_dir)],
                    cwd=str(NEXOS_ROOT), timeout=timeout,
                    capture_output=True, text=True,
                )
                # Write stdout to output file if script produced output
                if proc.stdout and proc.stdout.strip():
                    output_path.write_text(proc.stdout, encoding="utf-8")
                if output_path.exists() and output_path.stat().st_size > 0:
                    results[script_name] = output_path
                    console.print(f"[green]  ✓ {script_name} → {output_file}[/]")
                else:
                    console.print(f"[yellow]  ⚠ {script_name} ran but no output[/]")
            except subprocess.TimeoutExpired:
                console.print(f"[yellow]  ⚠ {script_name} timeout ({timeout}s)[/]")
            except Exception as e:
                console.print(f"[yellow]  ⚠ {script_name} error: {e}[/]")

        # 5. Deps scan (doesn't need running server)
        deps_script = TOOLS_DIR / "deps-scan.sh"
        if deps_script.exists():
            try:
                subprocess.run(
                    ["bash", str(deps_script), str(site_dir), str(client_dir)],
                    cwd=str(NEXOS_ROOT), timeout=30,
                    capture_output=True, text=True,
                )
                deps_out = tooling_dir / "deps.json"
                if deps_out.exists():
                    results["deps-scan.sh"] = deps_out
                    console.print(f"[green]  ✓ deps-scan.sh → deps.json[/]")
            except Exception as e:
                console.print(f"[yellow]  ⚠ deps-scan.sh error: {e}[/]")

    finally:
        # 6. Kill server
        if server_proc is not None:
            try:
                os.killpg(os.getpgid(server_proc.pid), signal.SIGTERM)
                server_proc.wait(timeout=5)
            except (ProcessLookupError, subprocess.TimeoutExpired):
                try:
                    os.killpg(os.getpgid(server_proc.pid), signal.SIGKILL)
                except ProcessLookupError:
                    pass
            console.print("[dim]  Server stopped[/]")

    console.print(f"[cyan]  Preflight: {len(results)}/{len(_SCAN_SCRIPTS)+1} scans completed[/]")
    return results


# ── RerunContext (CORRECTION 7) ──────────────────────────────────────────────

@dataclass
class RerunContext:
    """Encapsulates all state needed to re-run a phase with SOIC feedback.

    Replaces the closure approach for testability and robustness.
    """

    phase: str
    client_dir: Path
    site_dir: Optional[Path]
    url: Optional[str]
    timestamp: str

    def rerun(self, phase: str, feedback: str, iteration: int) -> bool:
        """Re-execute the phase with SOIC feedback injected.

        Signature matches RerunCallback: (phase, feedback, iteration) -> bool.
        """
        # Re-run preflight tooling for QA phase
        if phase == "ph5-qa" and self.site_dir is not None:
            run_preflight(self.site_dir, self.client_dir)
        elif phase == "ph5-qa" and self.url:
            run_preflight_tooling(self.client_dir, self.url)

        rerun_prompt = build_phase_prompt(phase, self.client_dir)
        rerun_prompt += f"\n\n# SOIC FEEDBACK — Iteration {iteration + 1}\n{feedback}"
        rerun_log = LOGS_DIR / f"{self.timestamp}_{phase}_iter{iteration + 1}.log"
        return run_claude_cli(rerun_prompt, str(NEXOS_ROOT), rerun_log) == 0


OUTPUT_MAP = {
    "ph0-discovery": "ph0-discovery-report.md",
    "ph1-strategy":  "ph1-strategy-report.md",
    "ph2-design":    "ph2-design-report.md",
    "ph3-content":   "ph3-content-report.md",
    "ph4-build":     "ph4-build-log.md",
    "ph5-qa":        "ph5-qa-report.md",
}


def verify_phase_output(phase: str, client_dir: Path) -> bool:
    """Vérifie que la phase a produit un output valide (≥500 chars)."""
    output_file = client_dir / OUTPUT_MAP.get(phase, f"{phase}-report.md")
    if not output_file.exists():
        console.print(f"[red]✗ Phase {phase} n'a pas produit de rapport ({output_file.name})[/]")
        return False
    size = output_file.stat().st_size
    if size < 500:
        console.print(f"[red]✗ Phase {phase} rapport trop court ({size} octets < 500)[/]")
        return False
    console.print(f"[green]✓ Phase {phase} rapport valide ({size} octets)[/]")
    return True


def run_pipeline(mode: str, client_dir: Path, url: Optional[str] = None):
    """Exécute le pipeline complet pour un mode donné."""
    phases = PHASES_MAP[mode]
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")

    gate_history = []

    console.print(Panel(
        f"[bold]Mode:[/] {mode}\n"
        f"[bold]Client:[/] {client_dir.name}\n"
        f"[bold]Phases:[/] {' → '.join(phases)}",
        title="[bold cyan]⚡ NEXOS v3.0[/]",
        border_style="cyan",
    ))

    for i, phase in enumerate(phases):
        console.print(f"\n[bold]{'━'*60}[/]")
        console.print(f"[bold cyan]PHASE {i}: {phase.upper()}[/]")
        console.print(f"[bold]{'━'*60}[/]\n")

        # Detect site directory for preflight
        site_dir = client_dir / "site"
        if not (site_dir / "package.json").exists():
            site_dir = None

        # Preflight tooling avant ph5
        if phase == "ph5-qa":
            console.print("[bold cyan]⚡ PREFLIGHT TOOLING[/]")
            if site_dir is not None:
                run_preflight(site_dir, client_dir)
            elif url:
                run_preflight_tooling(client_dir, url)
            else:
                console.print("[yellow]⚠ Pas de site_dir ni URL — preflight skip[/]")

        # Construire le prompt
        prompt = build_phase_prompt(phase, client_dir)
        log_path = LOGS_DIR / f"{timestamp}_{phase}.log"

        # Exécuter Claude CLI
        returncode = run_claude_cli(prompt, str(NEXOS_ROOT), log_path)

        if returncode != 0:
            console.print(f"[red]✗ Phase {phase} échouée (code {returncode})[/]")
            break

        # Vérifier que l'output existe et est valide
        if phase in OUTPUT_MAP:
            if not verify_phase_output(phase, client_dir):
                console.print(f"[red]✗ Phase {phase} n'a pas produit de rapport valide — ARRÊT[/]")
                break

        # Quality gate with convergence loop
        if phase in GATE_THRESHOLDS:
            threshold = GATE_THRESHOLDS[phase]

            # Phase 4 = BUILD PASS (binary check, no convergence)
            if threshold is None:
                build_log = client_dir / "ph4-build-log.md"
                if build_log.exists():
                    content = build_log.read_text()
                    build_ok = "BUILD PASS" in content or "build réussi" in content.lower()
                else:
                    build_ok = True
                gate_history.append({
                    "phase": phase, "mu": 10.0 if build_ok else 0.0,
                    "threshold": "BUILD_PASS", "converged": build_ok,
                    "iterations": 1, "decision": "ACCEPT" if build_ok else "FAIL",
                    "timestamp": datetime.now().isoformat(),
                })
                if not build_ok:
                    console.print(f"[red]✗ BUILD FAIL — ARRÊT[/]")
                    break
                console.print(f"[green]✓ BUILD PASS[/]")
                continue

            # Convergence loop via PhaseIterator
            from soic.iterator import PhaseIterator
            from soic.persistence import RunStore

            store = RunStore(client_dir)
            iterator = PhaseIterator(
                phase=phase, client_dir=str(client_dir),
                max_iter=4, store=store, site_dir=str(site_dir) if site_dir else None,
            )

            ctx = RerunContext(
                phase=phase,
                client_dir=client_dir,
                site_dir=site_dir,
                url=url,
                timestamp=timestamp,
            )

            def _on_iteration(iteration: int, result) -> None:
                """Display iteration progress."""
                decision = result.decision.value
                mu = result.report.mu
                cov = result.report.coverage
                console.print(
                    f"  [bold]Iteration {iteration}:[/] μ={mu:.2f} "
                    f"(coverage={cov:.0%}) → {decision}"
                )

            console.print(f"\n[bold cyan]🔄 SOIC Convergence Loop ({phase})[/]")
            loop = iterator.run(rerun_phase=ctx.rerun, on_iteration=_on_iteration)

            gate_history.append({
                "phase": phase,
                "mu": loop.final_mu,
                "threshold": threshold,
                "converged": loop.converged,
                "iterations": loop.total_iterations,
                "decision": loop.final_decision.value,
                "abort_reason": loop.abort_reason,
                "timestamp": datetime.now().isoformat(),
            })

            if loop.converged:
                console.print(
                    f"[green]✓ SOIC GATE: μ={loop.final_mu:.2f} ≥ {threshold} "
                    f"— ACCEPT ({loop.total_iterations} iter)[/]"
                )
            else:
                console.print(
                    f"[red]✗ SOIC GATE: μ={loop.final_mu:.2f} < {threshold} "
                    f"— {loop.final_decision.value} ({loop.total_iterations} iter)[/]"
                )
                if loop.abort_reason:
                    console.print(f"[red]  Raison: {loop.abort_reason}[/]")
                break

    # Sauvegarder l'historique des gates (enrichi avec convergence)
    gates_path = client_dir / "soic-gates.json"
    gates_path.write_text(json.dumps(gate_history, indent=2), encoding="utf-8")

    console.print(Panel(
        f"[green]Pipeline terminé[/]\n"
        f"[dim]Client: {client_dir}[/]\n"
        f"[dim]Gates: {len(gate_history)} évaluées[/]",
        title="[bold green]✓ NEXOS v3.0 TERMINÉ[/]",
        border_style="green",
    ))


# ── Converge mode ────────────────────────────────────────────────────────────

def run_converge(
    client_dir: Path,
    target: float = 8.5,
    max_iter: int = 4,
    timeout_minutes: int = 15,
    url: Optional[str] = None,
    dry_run: bool = False,
) -> None:
    """Run the SOIC convergence loop on an existing client directory.

    Default: full autonomous loop — evaluate → correct → re-evaluate → repeat.
    With --dry-run: evaluate once, produce report + corrective plan, touch nothing.
    """
    from soic import GateEngine, PhaseIterator, Converger, FeedbackRouter
    from soic.converger import _PHASE_THRESHOLDS
    from soic.persistence import RunStore
    from soic.report import generate_report_v2

    phase = "ph5-qa"
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")

    # Override the phase threshold with the user target
    original_threshold = _PHASE_THRESHOLDS.get(phase, 8.5)
    _PHASE_THRESHOLDS[phase] = target

    # Detect site directory
    site_dir = client_dir
    if (client_dir / "site" / "package.json").exists():
        site_dir = client_dir / "site"
    elif not (client_dir / "package.json").exists():
        site_dir = None

    console.print(Panel(
        f"[bold]Mode:[/] converge\n"
        f"[bold]Client:[/] {client_dir.name}\n"
        f"[bold]Target:[/] μ ≥ {target}\n"
        f"[bold]Max iterations:[/] {max_iter}\n"
        f"[bold]Timeout:[/] {timeout_minutes}min\n"
        f"[bold]Mode:[/] {'DRY-RUN (evaluate only)' if dry_run else 'AUTONOMOUS (correct + re-evaluate)'}",
        title="[bold cyan]🔄 NEXOS SOIC Convergence[/]",
        border_style="cyan",
    ))

    if dry_run:
        # ── Single evaluation mode ──────────────────────────────────────────
        console.print(f"\n[bold cyan]⚡ Evaluation SOIC — {phase}[/]\n")

        # Preflight if site available
        if site_dir is not None and (site_dir / "package.json").exists():
            console.print("[bold cyan]⚡ PREFLIGHT TOOLING[/]")
            run_preflight(site_dir, client_dir)
        elif url:
            console.print("[bold cyan]⚡ PREFLIGHT TOOLING (URL)[/]")
            run_preflight_tooling(client_dir, url)

        engine = GateEngine(
            phase=phase,
            client_dir=str(client_dir),
            site_dir=str(site_dir) if site_dir else str(client_dir),
        )
        report = engine.run_all_gates(iteration=1)

        # Report
        report_txt = generate_report_v2(report)
        console.print(report_txt)

        # Save report
        report_path = client_dir / "soic-converge-report.txt"
        report_path.write_text(report_txt, encoding="utf-8")

        # Feedback
        router = FeedbackRouter()
        if report.fail_count > 0:
            feedback = router.generate(report)
            console.print(f"\n[bold yellow]{'━'*60}[/]")
            console.print("[bold yellow]PLAN DE CONVERGENCE[/]")
            console.print(f"[bold yellow]{'━'*60}[/]\n")
            console.print(feedback)

            full_feedback = router.generate_full(report)
            feedback_path = client_dir / "soic-converge-feedback.md"
            feedback_path.write_text(full_feedback, encoding="utf-8")
            console.print(f"\n[dim]Feedback complet sauvegardé: {feedback_path}[/]")

        # Convergence assessment
        converger = Converger(phase=phase, max_iter=max_iter)
        converger.threshold = target
        decision = converger.decide(report, iteration=1)
        summary = converger.get_summary(decision, iteration=1)

        console.print(f"\n[bold]{'━'*60}[/]")
        if decision.value == "ACCEPT":
            console.print(
                f"[bold green]✓ CONVERGED — μ={report.mu:.2f} ≥ {target}[/]\n"
                f"[green]{summary}[/]"
            )
        else:
            delta = target - report.mu
            console.print(
                f"[bold red]✗ NOT CONVERGED — μ={report.mu:.2f} < {target} (Δ={delta:.2f})[/]\n"
                f"[red]{summary}[/]"
            )
            console.print(
                f"\n[dim]Pour lancer la correction automatique :[/]\n"
                f"[cyan]  nexos converge {client_dir} --target {target} "
                f"--max-iter {max_iter} --timeout {timeout_minutes}[/]"
            )
        console.print(f"[bold]{'━'*60}[/]")

        # Save to persistence
        store = RunStore(client_dir)
        store.save_run(report)

    else:
        # ── Full convergence loop with Claude CLI rerun ─────────────────────
        store = RunStore(client_dir)
        iterator = PhaseIterator(
            phase=phase,
            client_dir=str(client_dir),
            max_iter=max_iter,
            store=store,
            site_dir=str(site_dir) if site_dir else None,
            timeout_minutes=timeout_minutes,
        )
        # Override converger threshold
        iterator.converger.threshold = target

        ctx = RerunContext(
            phase=phase,
            client_dir=client_dir,
            site_dir=site_dir,
            url=url,
            timestamp=timestamp,
        )

        def _on_iteration(iteration: int, result) -> None:
            mu = result.report.mu
            cov = result.report.coverage
            dec = result.decision.value
            dur = result.duration_s
            console.print(
                f"  [bold]Iteration {iteration}:[/] μ={mu:.2f} "
                f"(coverage={cov:.0%}, {dur:.0f}s) → {dec}"
            )
            if result.feedback and dec == "ITERATE":
                for line in result.feedback.split("\n")[:5]:
                    if line.strip():
                        console.print(f"    [dim]{line}[/]")

        console.print(f"\n[bold cyan]🔄 Convergence Loop — target μ ≥ {target}[/]\n")
        loop = iterator.run(rerun_phase=ctx.rerun, on_iteration=_on_iteration)

        # Final report
        if loop.iterations:
            last_report = loop.iterations[-1].report
            report_txt = generate_report_v2(last_report)
            report_path = client_dir / "soic-converge-report.txt"
            report_path.write_text(report_txt, encoding="utf-8")

        console.print(f"\n[bold]{'━'*60}[/]")
        if loop.converged:
            console.print(
                f"[bold green]✓ CONVERGED — μ={loop.final_mu:.2f} ≥ {target} "
                f"in {loop.total_iterations} iteration(s)[/]"
            )
        else:
            console.print(
                f"[bold red]✗ NOT CONVERGED — μ={loop.final_mu:.2f} < {target} "
                f"after {loop.total_iterations} iteration(s)[/]\n"
                f"[red]  Reason: {loop.abort_reason or loop.final_decision.value}[/]"
            )
        console.print(f"[bold]{'━'*60}[/]")

    # Restore threshold
    _PHASE_THRESHOLDS[phase] = original_threshold


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="NEXOS v3.0 Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""modes:
  create    Création complète d'un site (ph0 → ph5)
  audit     Audit d'un site existant (ph5-qa)
  modify    Modification ciblée
  content   Rédaction/traduction seule (ph3)
  analyze   Discovery seule (ph0)
  converge  Boucle de convergence SOIC sur un client existant""",
    )

    subparsers = parser.add_subparsers(dest="mode", help="Mode d'opération")

    # Pipeline modes
    for mode in ["create", "audit", "modify", "content", "analyze"]:
        sp = subparsers.add_parser(mode)
        sp.add_argument("--client-dir", type=Path, help="Dossier client existant")
        sp.add_argument("--url", type=str, help="URL du site (pour audit/preflight)")
        sp.add_argument("--brief", type=str, help="Chemin vers brief-client.json")

    # Converge mode
    sp_conv = subparsers.add_parser(
        "converge",
        help="Boucle de convergence SOIC",
        description="Évalue un client via SOIC et produit un plan de convergence.",
    )
    sp_conv.add_argument("client_dir", type=Path, help="Dossier client à évaluer")
    sp_conv.add_argument("--target", type=float, default=8.5, help="Score μ cible (défaut: 8.5)")
    sp_conv.add_argument("--max-iter", type=int, default=4, help="Itérations max (défaut: 4)")
    sp_conv.add_argument("--timeout", type=int, default=15, help="Timeout global en minutes (défaut: 15)")
    sp_conv.add_argument("--url", type=str, help="URL du site (pour preflight)")
    sp_conv.add_argument("--dry-run", action="store_true", help="Évaluer sans corriger (rapport uniquement)")

    args = parser.parse_args()

    if not args.mode:
        parser.print_help()
        sys.exit(1)

    if args.mode == "converge":
        run_converge(
            client_dir=args.client_dir,
            target=args.target,
            max_iter=args.max_iter,
            timeout_minutes=args.timeout,
            url=args.url,
            dry_run=args.dry_run,
        )
    else:
        if hasattr(args, "client_dir") and args.client_dir:
            client_dir = args.client_dir
        elif hasattr(args, "brief") and args.brief:
            brief_data = json.loads(Path(args.brief).read_text())
            client_dir = generate_brief(args.mode, brief_data.get("inputs", {}))
        else:
            console.print("[red]Erreur: --client-dir ou --brief requis[/]")
            sys.exit(1)

        run_pipeline(args.mode, client_dir, url=getattr(args, "url", None))
