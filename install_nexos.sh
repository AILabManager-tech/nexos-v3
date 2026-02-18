#!/bin/bash
# Install NEXOS CLI as a system command
# Run: bash install.sh

NEXOS_ROOT="$HOME/___00___MARK_SYSTEMS_BIZ___/NEXOS/nexos_v.3.0"
CLI_PATH="$NEXOS_ROOT/nexos_cli.py"
LINK_PATH="$HOME/.local/bin/nexos"

# Copy CLI to NEXOS root
cp nexos_cli.py "$CLI_PATH" 2>/dev/null || true
chmod +x "$CLI_PATH"

# Create symlink
mkdir -p "$HOME/.local/bin"
ln -sf "$CLI_PATH" "$LINK_PATH"

# Make sure ~/.local/bin is in PATH
if ! echo "$PATH" | grep -q "$HOME/.local/bin"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc" 2>/dev/null
    export PATH="$HOME/.local/bin:$PATH"
fi

echo "✅ NEXOS CLI installé"
echo ""
echo "Commandes disponibles :"
echo "  nexos audit clients/USINE_RH"
echo "  nexos audit clients/USINE_RH --all-branches"
echo "  nexos converge clients/USINE_RH --target 9.5"
echo "  nexos fix clients/USINE_RH"
echo "  nexos fix clients/USINE_RH --dry-run"
echo "  nexos report clients/USINE_RH"
echo ""
echo "La commande magique :"
echo "  nexos converge clients/USINE_RH_industrielle --target 9.5 --max-iter 5"
echo "  → audit → fix → re-audit → fix → ... → μ ≥ 9.5 ou plateau"
