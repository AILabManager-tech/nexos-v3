"""SOIC v3.0 — Persistence: JSONL storage per client for run history."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .models import PhaseGateReport

_RUNS_FILE = "soic-runs.jsonl"


class RunStore:
    """Append-only JSONL store scoped to a client directory."""

    def __init__(self, client_dir: str | Path) -> None:
        self.client_dir = Path(client_dir)
        self.runs_file = self.client_dir / _RUNS_FILE

    def save_run(self, report: PhaseGateReport) -> Path:
        """Append a run report to the client's JSONL file."""
        self.client_dir.mkdir(parents=True, exist_ok=True)
        with self.runs_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(report.to_dict(), ensure_ascii=False) + "\n")
        return self.runs_file

    def get_history(self, limit: int = 20, phase: str | None = None) -> list[dict[str, Any]]:
        """Return the last N runs, optionally filtered by phase."""
        if not self.runs_file.exists():
            return []
        lines = self.runs_file.read_text(encoding="utf-8").strip().splitlines()
        entries = []
        for line in lines:
            if not line.strip():
                continue
            try:
                entry = json.loads(line)
                if phase and entry.get("phase") != phase:
                    continue
                entries.append(entry)
            except json.JSONDecodeError:
                continue
        return entries[-limit:]

    def get_latest(self, phase: str | None = None) -> dict[str, Any] | None:
        """Return the most recent run for a phase, or None."""
        history = self.get_history(limit=1, phase=phase)
        return history[0] if history else None
