#!/bin/bash
# Scan SSL/TLS et output résumé JSON
URL="${1:?Usage: ssl-scan.sh <URL>}"

# Extraire le domaine
DOMAIN=$(echo "$URL" | sed 's|https\?://||' | sed 's|/.*||')

if command -v testssl.sh &>/dev/null; then
    testssl.sh --jsonfile /dev/stdout --quiet "$DOMAIN" 2>/dev/null
elif command -v testssl &>/dev/null; then
    testssl --jsonfile /dev/stdout --quiet "$DOMAIN" 2>/dev/null
else
    # Fallback: openssl basique
    echo '{"grade": "unknown", "note": "testssl.sh non disponible, fallback openssl"}'
    CERT_INFO=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -dates -issuer 2>/dev/null)
    echo "$CERT_INFO"
fi
