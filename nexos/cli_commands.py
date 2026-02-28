"""
NEXOS v4.0 — Commandes CLI additionnelles

Implémente les commandes `nexos fix`, `nexos report`, `nexos doctor`.
"""

import json
from pathlib import Path

from nexos.build_validator import validate_build, format_build_report, _check_critical_files, _check_vercel_headers
from nexos.auto_fixer import auto_fix, REQUIRED_HEADERS

try:
    from rich.console import Console
    from rich.panel import Panel
    from rich.table import Table
    console = Console()
except ImportError:
    class Console:
        def print(self, *a, **kw): print(*a)
    console = Console()


def run_doctor():
    """Exécute le diagnostic complet du système."""
    from nexos.tooling_manager import doctor_report
    console.print(Panel(doctor_report(), title="[bold cyan]nexos doctor[/]", border_style="cyan"))


def run_fix(client_dir: Path, dry_run: bool = False):
    """
    Applique les auto-fixes D4/D8 sur un client sans lancer le pipeline.

    Si dry_run=True, analyse sans appliquer et montre ce qui serait corrigé.
    """
    # Détecter le répertoire site
    site_dir = client_dir / "site"
    if not (site_dir / "package.json").exists():
        # Peut-être que le client_dir EST le site (structure plate)
        if (client_dir / "package.json").exists():
            site_dir = client_dir
        else:
            console.print(f"[red]Erreur: pas de package.json dans {client_dir}/site/ ni {client_dir}/[/]")
            return

    console.print(Panel(
        f"[bold]Client:[/] {client_dir.name}\n"
        f"[bold]Site:[/] {site_dir}\n"
        f"[bold]Mode:[/] {'DRY RUN (analyse seule)' if dry_run else 'FIX (corrections appliquées)'}",
        title="[bold cyan]nexos fix[/]",
        border_style="cyan",
    ))

    # Validation avant fix
    console.print("\n[bold]Validation AVANT fix :[/]")
    result_before = validate_build(site_dir)
    console.print(format_build_report(result_before))

    if result_before.overall_pass and not dry_run:
        console.print("\n[green]Le build passe déjà — aucun fix nécessaire.[/]")
        return

    if dry_run:
        # Analyser sans appliquer
        console.print("\n[bold]Analyse des corrections possibles :[/]")
        _dry_run_analysis(site_dir, client_dir)
        return

    # Appliquer les fixes
    console.print("\n[bold]Application des corrections :[/]")
    brief_path = client_dir / "brief-client.json"
    brief = None
    if brief_path.exists():
        try:
            brief = json.loads(brief_path.read_text())
        except json.JSONDecodeError:
            pass

    fix_report = auto_fix(site_dir, client_dir, brief)

    # Validation après fix
    console.print("\n[bold]Validation APRES fix :[/]")
    result_after = validate_build(site_dir)
    console.print(format_build_report(result_after))

    # Résumé
    console.print(f"\n[bold]Résumé :[/]")
    console.print(f"  Corrections appliquées : {fix_report.total_fixes}")
    if fix_report.cookie_consent_added:
        console.print("    + Cookie consent injecté")
    if fix_report.npm_audit_fixed > 0:
        console.print(f"    + npm audit fix ({fix_report.npm_audit_fixed} vulns)")
    if fix_report.vercel_headers_fixed:
        console.print("    + Headers sécurité ajoutés")
    if fix_report.next_config_patched:
        console.print("    + next.config patché")
    if fix_report.privacy_page_added:
        console.print("    + Page politique-confidentialite générée")
    if fix_report.legal_page_added:
        console.print("    + Page mentions-legales générée")

    if result_after.overall_pass:
        console.print("\n[green bold]BUILD PASS après corrections[/]")
    else:
        console.print("\n[yellow]BUILD FAIL persistant — intervention manuelle requise[/]")


def _dry_run_analysis(site_dir: Path, client_dir: Path):
    """Analyse ce qui serait corrigé sans appliquer."""
    findings: list[str] = []

    # Cookie consent
    components_dir = site_dir / "src" / "components"
    has_consent = False
    if components_dir.exists():
        for f in components_dir.rglob("*"):
            if f.is_file() and "cookie" in f.name.lower() and "consent" in f.name.lower():
                has_consent = True
                break
    if not has_consent:
        findings.append("Cookie consent absent → copierait template + injection layout.tsx")

    # Vercel headers
    vercel_path = site_dir / "vercel.json"
    if not vercel_path.exists():
        findings.append("vercel.json absent → créerait depuis template")
    else:
        try:
            data = json.loads(vercel_path.read_text())
            existing = set()
            for block in data.get("headers", []):
                for h in block.get("headers", []):
                    existing.add(h.get("key", "").lower())
            missing = [k for k in REQUIRED_HEADERS if k.lower() not in existing]
            if missing:
                findings.append(f"Headers manquants dans vercel.json: {', '.join(missing)}")
        except json.JSONDecodeError:
            findings.append("vercel.json corrompu → remplacerait par template")

    # next.config
    for config_name in ["next.config.mjs", "next.config.js", "next.config.ts"]:
        config_path = site_dir / config_name
        if config_path.exists():
            content = config_path.read_text()
            if "poweredByHeader" not in content:
                findings.append(f"{config_name}: poweredByHeader manquant → ajouterait false")
            elif "poweredByHeader: true" in content:
                findings.append(f"{config_name}: poweredByHeader=true → changerait à false")
            break

    # Pages légales
    for page_name, label in [
        ("politique-confidentialite", "Politique confidentialité"),
        ("mentions-legales", "Mentions légales"),
    ]:
        found = False
        for base in ["src/app/[locale]", "src/app"]:
            if (site_dir / base / page_name / "page.tsx").exists():
                found = True
                break
        if not found:
            findings.append(f"Page {label} absente → générerait depuis template")

    # npm audit
    findings.append("npm audit fix → exécuterait pour corriger les vulnérabilités connues")

    if findings:
        for i, f in enumerate(findings, 1):
            console.print(f"  {i}. {f}")
    else:
        console.print("  Aucune correction nécessaire.")


def run_report(client_dir: Path):
    """Affiche un rapport agrégé pour un client."""
    console.print(Panel(
        f"[bold]Client:[/] {client_dir.name}",
        title="[bold cyan]nexos report[/]",
        border_style="cyan",
    ))

    # 1. Phases complétées
    phase_reports = {
        "ph0-discovery": "ph0-discovery-report.md",
        "ph1-strategy": "ph1-strategy-report.md",
        "ph2-design": "ph2-design-report.md",
        "ph3-content": "ph3-content-report.md",
        "ph4-build": "ph4-build-log.md",
        "ph5-qa": "ph5-qa-report.md",
    }

    console.print("\n[bold]Phases :[/]")
    for phase, filename in phase_reports.items():
        path = client_dir / filename
        if path.exists():
            size = path.stat().st_size
            console.print(f"  [green]+[/] {phase:20s} ({size:,} octets)")
        else:
            console.print(f"  [dim]-[/] {phase:20s} (absent)")

    # 2. SOIC Gates
    gates_path = client_dir / "soic-gates.json"
    if gates_path.exists():
        try:
            gates = json.loads(gates_path.read_text())
            console.print("\n[bold]SOIC Gates :[/]")

            if isinstance(gates, list):
                gate_list = gates
            elif isinstance(gates, dict):
                gate_list = gates.get("gates", gates.get("history", []))
            else:
                gate_list = []

            for gate in gate_list:
                phase = gate.get("phase", "?")
                mu = gate.get("mu", gate.get("final_mu", 0))
                decision = gate.get("decision", gate.get("final_decision", "?"))
                iters = gate.get("iterations", gate.get("total_iterations", 1))
                icon = "green" if decision in ("ACCEPT", "PASS") else "red"
                console.print(
                    f"  [{icon}]{phase:20s}[/] μ={mu:.2f} "
                    f"({iters} iter) → {decision}"
                )
        except json.JSONDecodeError:
            console.print("\n[yellow]soic-gates.json corrompu[/]")
    else:
        console.print("\n[dim]Pas de soic-gates.json[/]")

    # 3. Tooling results
    tooling_dir = client_dir / "tooling"
    if tooling_dir.exists():
        console.print("\n[bold]Tooling :[/]")
        for f in sorted(tooling_dir.iterdir()):
            if f.is_file():
                console.print(f"  [green]+[/] {f.name} ({f.stat().st_size:,} octets)")
    else:
        console.print("\n[dim]Pas de dossier tooling/[/]")

    # 4. Site directory
    site_dir = client_dir / "site"
    if (site_dir / "package.json").exists():
        console.print(f"\n[bold]Site :[/] {site_dir}")
        # Quick build status check
        console.print("[dim]  Validation rapide...[/]")
        missing = _check_critical_files(site_dir)
        headers_ok = _check_vercel_headers(site_dir)
        if missing:
            console.print(f"  [yellow]Fichiers manquants: {', '.join(missing)}[/]")
        else:
            console.print("  [green]+[/] Tous les fichiers critiques présents")
        icon = "green" if headers_ok else "yellow"
        console.print(f"  [{icon}]{'+'if headers_ok else '-'}[/] Headers sécurité vercel.json")
    elif (client_dir / "package.json").exists():
        console.print(f"\n[bold]Site :[/] {client_dir} (structure plate)")

    # 5. Brief
    brief_path = client_dir / "brief-client.json"
    if brief_path.exists():
        try:
            brief = json.loads(brief_path.read_text())
            company = brief.get("company_name", brief.get("inputs", {}).get("company_name", "?"))
            console.print(f"\n[bold]Brief :[/] {company}")
            legal = brief.get("legal", {})
            if legal:
                rpp = legal.get("rpp_name", "non défini")
                console.print(f"  RPP: {rpp}")
        except json.JSONDecodeError:
            console.print("\n[yellow]brief-client.json corrompu[/]")
