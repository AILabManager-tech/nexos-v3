#!/bin/bash
# Scan sobriété web via OSIRIS
URL="${1:?Usage: osiris-scan.sh <URL>}"
OSIRIS_PATH="${OSIRIS_PATH:-$HOME/osiris-scanner}"

if [ -d "$OSIRIS_PATH" ]; then
    python3 "$OSIRIS_PATH/scanner.py" "$URL" --format json 2>/dev/null
else
    echo '{"error": "osiris-scanner not found", "path": "'"$OSIRIS_PATH"'"}'
fi
