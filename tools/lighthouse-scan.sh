#!/bin/bash
# Scan Lighthouse complet
URL="${1:?Usage: lighthouse-scan.sh <URL>}"

lighthouse "$URL" \
    --output json \
    --output-path /dev/stdout \
    --chrome-flags="--headless --no-sandbox --disable-gpu" \
    --quiet 2>/dev/null
