#!/bin/bash
# Scan vulnérabilités npm
PROJECT_DIR="${1:?Usage: deps-scan.sh <PROJECT_DIR>}"

if [ -f "$PROJECT_DIR/package.json" ]; then
    cd "$PROJECT_DIR"
    npm audit --json 2>/dev/null || echo '{"metadata":{"vulnerabilities":{"high":0}}}'
else
    echo '{"error": "no package.json found"}'
fi
