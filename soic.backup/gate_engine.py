"""SOIC v3.0 — GateEngine: orchestrates quality gate execution for a phase."""

from __future__ import annotations

from pathlib import Path

from .domain_grids import get_phase_gates
from .models import PhaseGateReport, SOICScore


class GateEngine:
    """Orchestrates gate execution for a given NEXOS phase."""

    def __init__(self, phase: str, client_dir: str, site_dir: str | None = None) -> None:
        self.phase = phase
        self.client_dir = client_dir
        self.site_dir = site_dir or str(Path(client_dir) / "site")
        self.gates = get_phase_gates(phase)

    def run_gate(self, gate_id: str):
        """Execute a single gate by ID."""
        for gate in self.gates:
            if gate.gate_id == gate_id:
                return gate.run(self.client_dir, self.site_dir)
        raise ValueError(f"Gate {gate_id!r} not found for phase {self.phase}")

    def run_all_gates(self, iteration: int = 1) -> PhaseGateReport:
        """Execute all gates for this phase and return a PhaseGateReport."""
        client_slug = Path(self.client_dir).name
        report = PhaseGateReport(
            phase=self.phase,
            client_slug=client_slug,
            iteration=iteration,
        )

        for gate in self.gates:
            result = gate.run(self.client_dir, self.site_dir)
            report.gates.append(result)

        report.compute_score()
        return report

    def get_score(self, report: PhaseGateReport) -> SOICScore:
        """Compute score from an existing report."""
        return report.compute_score()
