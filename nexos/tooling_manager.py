"""
NEXOS v4.0 — Tooling Manager

Vérifie que les outils CLI requis sont installés avant de lancer le pipeline.
Dégradation gracieuse pour les outils optionnels (lighthouse, pa11y).
"""

import re
import subprocess
from typing import Optional

try:
    from rich.console import Console
    from rich.table import Table
    console = Console()
except ImportError:
    class Console:
        def print(self, *a, **kw): print(*a)
    console = Console()


# ── Outils requis ────────────────────────────────────────────────────

REQUIRED_TOOLS: dict[str, dict] = {
    "node": {
        "cmd": ["node", "--version"],
        "min_version": "20.0.0",
        "install": "https://nodejs.org",
        "critical": True,
    },
    "npm": {
        "cmd": ["npm", "--version"],
        "min_version": None,
        "install": "inclus avec node",
        "critical": True,
    },
    "claude": {
        "cmd": ["claude", "--version"],
        "min_version": None,
        "install": "npm i -g @anthropic-ai/claude-code",
        "critical": True,
    },
    "lighthouse": {
        "cmd": ["lighthouse", "--version"],
        "min_version": None,
        "install": "npm i -g lighthouse",
        "critical": False,
    },
    "pa11y": {
        "cmd": ["pa11y", "--version"],
        "min_version": None,
        "install": "npm i -g pa11y",
        "critical": False,
    },
}


def _parse_version(version_str: str) -> tuple[int, ...]:
    """Extrait les composants numériques d'une version (ex: 'v20.11.1' → (20, 11, 1))."""
    match = re.search(r"(\d+(?:\.\d+)*)", version_str)
    if not match:
        return (0,)
    return tuple(int(x) for x in match.group(1).split("."))


def check_tool(name: str) -> tuple[bool, Optional[str]]:
    """Vérifie si un outil est installé. Retourne (disponible, version)."""
    if name not in REQUIRED_TOOLS:
        return False, None

    tool = REQUIRED_TOOLS[name]
    try:
        result = subprocess.run(
            tool["cmd"],
            capture_output=True,
            text=True,
            timeout=10,
        )
        version_str = result.stdout.strip() or result.stderr.strip()

        # Vérifier version minimale si spécifiée
        if tool["min_version"] and version_str:
            current = _parse_version(version_str)
            minimum = _parse_version(tool["min_version"])
            if current < minimum:
                return False, version_str

        return True, version_str
    except FileNotFoundError:
        return False, None
    except subprocess.TimeoutExpired:
        return False, None
    except OSError:
        return False, None


def ensure_tooling(interactive: bool = True) -> dict[str, bool]:
    """
    Vérifie tous les outils requis.

    Si interactive=True, affiche un rapport et propose d'installer les manquants.
    Si interactive=False, affiche warnings/erreurs et retourne le statut.

    Lève RuntimeError si un outil critique manque (node, npm, claude).
    """
    results: dict[str, bool] = {}
    missing_critical: list[str] = []
    missing_optional: list[str] = []

    for name, tool in REQUIRED_TOOLS.items():
        available, version = check_tool(name)
        results[name] = available

        if not available:
            if tool["critical"]:
                missing_critical.append(name)
                console.print(f"[red]  ERREUR: {name} non trouvé — {tool['install']}[/]")
            else:
                missing_optional.append(name)
                console.print(f"[yellow]  WARNING: {name} non trouvé — {tool['install']}[/]")

    if missing_critical:
        raise RuntimeError(
            f"Outils critiques manquants: {', '.join(missing_critical)}. "
            "Installez-les avant de lancer le pipeline."
        )

    if missing_optional and interactive:
        console.print("\n[cyan]Outils optionnels manquants. Installer ? (npm i -g ...)[/]")
        for name in missing_optional:
            tool = REQUIRED_TOOLS[name]
            try:
                answer = input(f"  Installer {name} ? [O/n] ").strip().lower()
                if answer in ("", "o", "oui", "y", "yes"):
                    console.print(f"  Installation de {name}...")
                    subprocess.run(
                        ["npm", "i", "-g", name],
                        timeout=120,
                        check=True,
                    )
                    results[name] = True
                    console.print(f"[green]  {name} installé.[/]")
            except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
                console.print(f"[yellow]  Échec installation {name}: {e}[/]")

    return results


def doctor_report() -> str:
    """Retourne un rapport formaté de l'état des outils (pour `nexos doctor`)."""
    lines = ["NEXOS v4.0 — Doctor Report", "=" * 40]

    for name, tool in REQUIRED_TOOLS.items():
        available, version = check_tool(name)
        status = "OK" if available else "MANQUANT"
        icon = "+" if available else "-"
        version_display = version or "N/A"
        critical_tag = " [CRITIQUE]" if tool["critical"] else ""

        lines.append(f"  [{icon}] {name:12s} {version_display:20s} {status}{critical_tag}")

        # Avertissement version minimale
        if available and tool["min_version"] and version:
            current = _parse_version(version)
            minimum = _parse_version(tool["min_version"])
            if current < minimum:
                lines.append(f"      ATTENTION: version {version} < minimum {tool['min_version']}")

    lines.append("=" * 40)

    all_ok = all(check_tool(n)[0] for n in REQUIRED_TOOLS)
    if all_ok:
        lines.append("Statut: TOUS LES OUTILS OK")
    else:
        missing = [n for n in REQUIRED_TOOLS if not check_tool(n)[0]]
        lines.append(f"Statut: {len(missing)} outil(s) manquant(s): {', '.join(missing)}")

    return "\n".join(lines)
