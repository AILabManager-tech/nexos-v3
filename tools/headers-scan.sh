#!/bin/bash
# Fetch HTTP headers et output en JSON
URL="${1:?Usage: headers-scan.sh <URL>}"

# Recupere les headers avec timeout et suivi des redirections
HEADERS=$(curl -sI -L --max-time 30 --max-redirs 5 "$URL" 2>/dev/null | tr -d '\r')

if [ -z "$HEADERS" ]; then
    echo '{"error": "unable to fetch headers", "url": "'"$URL"'"}'
    exit 1
fi

# Convertit en JSON
echo "{"
echo '  "url": "'"$URL"'",'

first=true
while IFS=': ' read -r key value; do
    [ -z "$key" ] && continue
    # Skip les lignes de statut HTTP
    echo "$key" | grep -q "^HTTP" && continue
    if [ "$first" = true ]; then
        first=false
    else
        echo ","
    fi
    # Escape les guillemets dans la valeur
    value=$(echo "$value" | sed 's/"/\\"/g')
    key_lower=$(echo "$key" | tr '[:upper:]' '[:lower:]')
    printf '  "%s": "%s"' "$key_lower" "$value"
done <<< "$HEADERS"
echo ""
echo "}"
