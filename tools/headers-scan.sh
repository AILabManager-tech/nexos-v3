#!/bin/bash
# Fetch HTTP headers et output en JSON
URL="${1:?Usage: headers-scan.sh <URL>}"

# Récupère les headers
HEADERS=$(curl -sI "$URL" 2>/dev/null | tr -d '\r')

# Convertit en JSON
echo "{"
first=true
while IFS=': ' read -r key value; do
    [ -z "$key" ] && continue
    # Skip la ligne de statut HTTP
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
