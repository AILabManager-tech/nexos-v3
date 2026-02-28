#!/bin/bash
# Install NEXOS CLI as a system command
# Run: bash install.sh

# Auto-detect NEXOS root from script location
NEXOS_ROOT="$(cd "$(dirname "$0")" && pwd)"
CLI_PATH="$NEXOS_ROOT/nexos_cli.py"
LINK_PATH="$HOME/.local/bin/nexos"

if [ ! -f "$CLI_PATH" ]; then
    echo "ERREUR: nexos_cli.py introuvable dans $NEXOS_ROOT"
    exit 1
fi

chmod +x "$CLI_PATH"

# Create symlink
mkdir -p "$HOME/.local/bin"
ln -sf "$CLI_PATH" "$LINK_PATH"

# Make sure ~/.local/bin is in PATH for bash and zsh
EXPORT_LINE='export PATH="$HOME/.local/bin:$PATH"'
for rcfile in "$HOME/.bashrc" "$HOME/.zshrc"; do
    if [ -f "$rcfile" ] && ! grep -qF '.local/bin' "$rcfile"; then
        echo "$EXPORT_LINE" >> "$rcfile"
    fi
done
export PATH="$HOME/.local/bin:$PATH"

echo "✅ NEXOS v4.0 CLI installé"
echo ""
echo "Commandes disponibles :"
echo "  nexos doctor                              — Diagnostic système"
echo "  nexos audit clients/USINE_RH              — Audit site existant"
echo "  nexos fix clients/USINE_RH                — Auto-fix D4/D8"
echo "  nexos fix clients/USINE_RH --dry-run      — Analyse sans appliquer"
echo "  nexos report clients/USINE_RH             — Rapport agrégé"
echo "  nexos converge clients/USINE_RH --target 9.5"
echo ""
echo "La commande magique :"
echo "  nexos converge clients/USINE_RH_industrielle --target 9.5 --max-iter 5"
echo "  → audit → fix → re-audit → fix → ... → μ ≥ 9.5 ou plateau"
