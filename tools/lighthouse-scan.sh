#!/bin/bash
# Scan Lighthouse complet — output JSON vers stdout
URL="${1:?Usage: lighthouse-scan.sh <URL>}"

if ! command -v lighthouse &>/dev/null; then
    echo '{"error": "lighthouse not installed"}' >&2
    exit 1
fi

lighthouse "$URL" \
    --output json \
    --output-path stdout \
    --chrome-flags="--headless --no-sandbox --disable-gpu" \
    --max-wait-for-load=45000 \
    --quiet 2>/dev/null
