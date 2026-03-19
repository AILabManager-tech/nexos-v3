import json
import os
import subprocess
import sys
import unicodedata
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any

# --- CONFIGURATION NEXOS ---
NEXOS_ROOT = Path(__file__).parent.resolve()
CLIENTS_DIR = NEXOS_ROOT / "clients"

# Tentative d'import des modules NEXOS v4.0
sys.path.append(str(NEXOS_ROOT))
try:
    from orchestrator import slugify
except ImportError:
    def slugify(name: str) -> str:
        """Fallback slugify si orchestrator n'est pas importable."""
        slug = unicodedata.normalize("NFC", name).lower().strip()
        slug = unicodedata.normalize("NFD", slug)
        slug = "".join(c for c in slug if unicodedata.category(c) != "Mn")
        slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')
        return slug

try:
    from nexos.changelog import log_event, EventType
    _HAS_CHANGELOG = True
except ImportError:
    _HAS_CHANGELOG = False

# --- API GATEWAY ---
app = FastAPI(
    title="NEXOS_GATEWAY_INTEGRATOR",
    description="Transport Layer between n8n and AINOVA_OS (NEXOS v4.0)",
    version="4.0.0"
)

class BriefPayload(BaseModel):
    client: Dict[str, Any]
    company: Dict[str, Any]
    site: Dict[str, Any]
    legal: Dict[str, Any]

@app.post("/ingest-brief", status_code=status.HTTP_201_CREATED)
async def ingest_brief(payload: BriefPayload):
    """
    Endpoint d'ingestion industrielle des briefs clients.
    Valide, provisionne et trigger l'orchestrateur NEXOS.
    """
    try:
        data = payload.dict()
        
        # 1. Extraction et validation du Slug
        client_slug = data.get("client", {}).get("slug")
        if not client_slug:
            client_name = data.get("client", {}).get("name", "unnamed-project")
            client_slug = slugify(client_name)
        
        # Sécurité : Protection contre le Path Traversal
        if not re.match(r'^[a-z0-9-]+$', client_slug):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid slug format. Only lowercase alphanumeric and hyphens allowed."
            )

        # 2. Détermination du mode (Create vs Modify)
        client_dir = CLIENTS_DIR / client_slug
        mode = "create"
        if client_dir.exists():
            mode = "modify"

        # 3. Provisioning Répertoire
        client_dir.mkdir(parents=True, exist_ok=True)
        (client_dir / "site").mkdir(exist_ok=True)
        (client_dir / "tooling").mkdir(exist_ok=True)

        # 4. Persistance de la Source de Vérité
        brief_filename = "brief-client.json"
        brief_path = client_dir / brief_filename
        with open(brief_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # 5. Traçabilité (Changelog)
        if _HAS_CHANGELOG:
            log_event(
                client_dir,
                EventType.BRIEF_CREATED,
                agent="GATEWAY_INTEGRATOR",
                details={
                    "slug": client_slug,
                    "mode": mode,
                    "source": "n8n_ingestion"
                }
            )

        # 6. Trigger Orchestrateur (Détachement du processus pour réponse rapide)
        # Commande : nexos <mode> --brief clients/<slug>/brief-client.json
        cli_path = NEXOS_ROOT / "nexos_cli.py"
        cmd = [
            sys.executable,
            str(cli_path),
            mode,
            "--brief",
            str(brief_path)
        ]
        
        # Exécution asynchrone pour ne pas bloquer n8n
        subprocess.Popen(
            cmd,
            cwd=str(NEXOS_ROOT),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )

        return {
            "status": "201_CREATED",
            "client_slug": client_slug,
            "mode": mode,
            "abs_path": str(client_dir.absolute()),
            "message": f"NEXOS pipeline triggered in mode: {mode}"
        }

    except HTTPException:
        raise
    except Exception as e:
        # Log de l'erreur interne (idéalement vers un service de log centralisé)
        print(f"[ERROR] Gateway Ingestion Failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Industrial logic failure: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    # Lancement sur le port 8000 par défaut
    uvicorn.run(app, host="0.0.0.0", port=8000)
