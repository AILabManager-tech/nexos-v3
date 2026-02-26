#!/bin/bash
# Scan SSL/TLS et output resume JSON
URL="${1:?Usage: ssl-scan.sh <URL>}"

# Extraire le domaine
DOMAIN=$(echo "$URL" | sed 's|https\?://||' | sed 's|/.*||' | sed 's|:.*||')

if command -v testssl.sh &>/dev/null; then
    testssl.sh --jsonfile stdout --quiet "$DOMAIN" 2>/dev/null
elif command -v testssl &>/dev/null; then
    testssl --jsonfile stdout --quiet "$DOMAIN" 2>/dev/null
else
    # Fallback: openssl basique — produit du JSON valide
    CERT_RAW=$(echo | timeout 15 openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null)
    if [ $? -ne 0 ] || [ -z "$CERT_RAW" ]; then
        echo '{"grade": "error", "error": "unable to connect to '"$DOMAIN"':443"}'
        exit 1
    fi

    DATES=$(echo "$CERT_RAW" | openssl x509 -noout -dates 2>/dev/null)
    ISSUER=$(echo "$CERT_RAW" | openssl x509 -noout -issuer 2>/dev/null | sed 's/^issuer=//')
    SUBJECT=$(echo "$CERT_RAW" | openssl x509 -noout -subject 2>/dev/null | sed 's/^subject=//')
    NOT_BEFORE=$(echo "$DATES" | grep notBefore | sed 's/notBefore=//')
    NOT_AFTER=$(echo "$DATES" | grep notAfter | sed 's/notAfter=//')
    PROTOCOL=$(echo "$CERT_RAW" | grep "Protocol" | head -1 | awk '{print $NF}')

    # Escape quotes in values
    ISSUER=$(echo "$ISSUER" | sed 's/"/\\"/g')
    SUBJECT=$(echo "$SUBJECT" | sed 's/"/\\"/g')

    cat <<ENDJSON
{
  "grade": "unknown",
  "note": "testssl.sh non disponible, fallback openssl",
  "domain": "$DOMAIN",
  "protocol": "${PROTOCOL:-unknown}",
  "issuer": "$ISSUER",
  "subject": "$SUBJECT",
  "not_before": "$NOT_BEFORE",
  "not_after": "$NOT_AFTER"
}
ENDJSON
fi
