#!/bin/bash
# Scan accessibilité WCAG via pa11y
URL="${1:?Usage: a11y-scan.sh <URL>}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if command -v pa11y &>/dev/null; then
    pa11y "$URL" --reporter json --standard WCAG2AA \
        --config "$SCRIPT_DIR/pa11y.config.json" 2>/dev/null
else
    echo '[]'
    echo "⚠ pa11y non installé: npm i -g pa11y" >&2
fi
