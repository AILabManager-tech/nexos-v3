"""SOIC v3.0 — Converger: iteration decision engine for NEXOS.

Rules:
- D4 (Security) and D8 (Legal) are non-negotiable: FAIL blocks ACCEPT.
- Coverage < 0.7 → ABORT (insufficient tooling data).
- Plateau = mu stagnant AND fail count not decreasing → ABORT.
- max_iter default = 4 for a real chance at convergence.
"""

from __future__ import annotations

from enum import Enum

from .models import GateStatus, PhaseGateReport

# Phase thresholds for ACCEPT decision
_PHASE_THRESHOLDS: dict[str, float] = {
    "ph0-discovery": 7.0,
    "ph1-strategy": 8.0,
    "ph2-design": 8.0,
    "ph3-content": 8.0,
    "ph4-build": 7.0,
    "ph5-qa": 8.5,
}

# Non-negotiable dimensions: FAIL blocks ACCEPT regardless of mu
_BLOCKING_DIMENSIONS = {"D4", "D8"}

# Minimum coverage required to accept
_MIN_COVERAGE = 0.7


class Decision(str, Enum):
    """Convergence decision after an evaluation."""

    ACCEPT = "ACCEPT"
    ITERATE = "ITERATE"
    ABORT_PLATEAU = "ABORT_PLATEAU"
    ABORT_MAX_ITER = "ABORT_MAX_ITER"
    ABORT_LOW_COVERAGE = "ABORT_LOW_COVERAGE"


class Converger:
    """Decides whether to accept, iterate, or abort based on gate results."""

    def __init__(self, phase: str, max_iter: int = 4) -> None:
        self.phase = phase
        self.max_iter = max_iter
        self.mu_history: list[float] = []
        self.fail_history: list[int] = []
        self.threshold = _PHASE_THRESHOLDS.get(phase, 8.0)

    def decide(self, report: PhaseGateReport, iteration: int) -> Decision:
        """Evaluate the report and return a decision.

        Logic:
        1. coverage < 0.7 → ABORT_LOW_COVERAGE
        2. mu >= threshold AND no D4/D8 FAIL → ACCEPT
        3. iteration >= max_iter → ABORT_MAX_ITER
        4. Plateau (mu stagnant AND fail count not decreasing) → ABORT_PLATEAU
        5. Otherwise → ITERATE
        """
        self.mu_history.append(report.mu)
        self.fail_history.append(report.fail_count)

        # Coverage check — insufficient tooling data
        if report.coverage < _MIN_COVERAGE:
            return Decision.ABORT_LOW_COVERAGE

        # Check non-negotiable dimensions
        blocking_fail = any(
            g.status in (GateStatus.FAIL, GateStatus.ERROR)
            for g in report.gates
            if g.dimension in _BLOCKING_DIMENSIONS
        )

        # ACCEPT: mu meets threshold and no blocking failures
        if report.mu >= self.threshold and not blocking_fail:
            return Decision.ACCEPT

        # Max iterations reached
        if iteration >= self.max_iter:
            return Decision.ABORT_MAX_ITER

        # Plateau detection: mu stagnant AND fail count not decreasing
        if self._is_plateau():
            return Decision.ABORT_PLATEAU

        return Decision.ITERATE

    def _is_plateau(self) -> bool:
        """Detect plateau: 2 consecutive non-positive mu deltas.

        A single regression is NOT a plateau — it can be corrected on the next
        iteration.  We need at least 3 data points to detect true stagnation.
        """
        if len(self.mu_history) < 3:
            return False
        delta_prev = self.mu_history[-2] - self.mu_history[-3]
        delta_curr = self.mu_history[-1] - self.mu_history[-2]
        two_non_positive = delta_prev <= 0 and delta_curr <= 0
        # Even with stagnant mu, fewer failures = qualitative progress
        fewer_failures = self.fail_history[-1] < self.fail_history[-2]
        return two_non_positive and not fewer_failures

    def reset(self) -> None:
        """Reset history for a fresh run."""
        self.mu_history.clear()
        self.fail_history.clear()

    def get_summary(self, decision: Decision, iteration: int) -> str:
        """Return a human-readable summary of the decision."""
        mu_str = f"μ={self.mu_history[-1]:.2f}" if self.mu_history else "μ=N/A"
        summaries = {
            Decision.ACCEPT: f"ACCEPT — {mu_str} >= {self.threshold} (seuil {self.phase})",
            Decision.ITERATE: f"ITERATE — Iteration {iteration}/{self.max_iter} ({mu_str} < {self.threshold})",
            Decision.ABORT_PLATEAU: f"ABORT — Score plateau detected ({mu_str})",
            Decision.ABORT_MAX_ITER: f"ABORT — Max iterations reached ({mu_str})",
            Decision.ABORT_LOW_COVERAGE: f"ABORT — Couverture insuffisante (coverage < {_MIN_COVERAGE}) — executer le preflight d'abord",
        }
        return summaries[decision]
