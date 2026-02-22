"""SOIC v3.0 — PhaseIterator: orchestrates the evaluate-decide-feedback-rerun loop.

Features:
- rerun_phase callback (orchestrator re-executes Claude CLI with feedback)
- Per-client persistence via RunStore
- Global timeout (default 15 min) to prevent runaway loops
"""

from __future__ import annotations

import time
from collections.abc import Callable
from dataclasses import dataclass, field

from .converger import Converger, Decision
from .feedback_router import FeedbackRouter
from .gate_engine import GateEngine
from .models import PhaseGateReport
from .persistence import RunStore


@dataclass
class IterationResult:
    """Result of a single iteration within the loop."""

    iteration: int
    report: PhaseGateReport
    decision: Decision
    feedback: str
    summary: str
    duration_s: float = 0.0

    def to_dict(self) -> dict:
        return {
            "iteration": self.iteration,
            "report": self.report.to_dict(),
            "decision": self.decision.value,
            "feedback_length": len(self.feedback),
            "summary": self.summary,
            "duration_s": round(self.duration_s, 1),
        }


@dataclass
class LoopResult:
    """Full result of an iteration loop."""

    iterations: list[IterationResult] = field(default_factory=list)
    final_decision: Decision = Decision.ITERATE
    final_mu: float = 0.0
    abort_reason: str = ""

    @property
    def total_iterations(self) -> int:
        return len(self.iterations)

    @property
    def converged(self) -> bool:
        return self.final_decision == Decision.ACCEPT

    def to_dict(self) -> dict:
        return {
            "total_iterations": self.total_iterations,
            "converged": self.converged,
            "final_decision": self.final_decision.value,
            "final_mu": round(self.final_mu, 2),
            "abort_reason": self.abort_reason,
            "iterations": [it.to_dict() for it in self.iterations],
        }


# Type aliases
RerunCallback = Callable[[str, str, int], bool]  # (phase, feedback, iteration) -> success
IterationCallback = Callable[[int, IterationResult], None]  # (iteration, result) -> None


class PhaseIterator:
    """Orchestrates the full SOIC iteration loop for a NEXOS phase.

    Loop: evaluate -> decide -> feedback -> rerun -> (repeat or stop)
    """

    def __init__(
        self,
        phase: str,
        client_dir: str,
        max_iter: int = 4,
        store: RunStore | None = None,
        site_dir: str | None = None,
        timeout_minutes: int = 15,
    ) -> None:
        self.phase = phase
        self.client_dir = client_dir
        self.site_dir = site_dir
        self.max_iter = max_iter
        self.timeout_seconds = timeout_minutes * 60
        self.converger = Converger(phase=phase, max_iter=max_iter)
        self.feedback_router = FeedbackRouter()
        self.store = store or RunStore(client_dir)

    def run(
        self,
        rerun_phase: RerunCallback | None = None,
        on_iteration: IterationCallback | None = None,
    ) -> LoopResult:
        """Execute the full iteration loop.

        Args:
            rerun_phase: Callback to re-execute the phase with feedback.
                Signature: (phase, feedback_markdown, iteration) -> success.
                If None, the loop only evaluates once (no re-runs).
            on_iteration: Optional callback after each iteration for CLI output.

        Returns:
            LoopResult with all iteration details.
        """
        loop = LoopResult()
        loop_start = time.monotonic()

        for i in range(1, self.max_iter + 1):
            iter_start = time.monotonic()

            # Check global timeout before each iteration
            elapsed = time.monotonic() - loop_start
            if elapsed >= self.timeout_seconds:
                loop.final_decision = Decision.ABORT_MAX_ITER
                loop.final_mu = loop.iterations[-1].report.mu if loop.iterations else 0.0
                loop.abort_reason = f"Timeout global atteint ({self.timeout_seconds // 60}min)"
                break

            # 1. Evaluate
            engine = GateEngine(
                phase=self.phase,
                client_dir=self.client_dir,
                site_dir=self.site_dir,
            )
            report = engine.run_all_gates(iteration=i)
            self.store.save_run(report)

            # 2. Decide
            decision = self.converger.decide(report, iteration=i)
            summary = self.converger.get_summary(decision, iteration=i)

            # 3. Feedback
            if decision == Decision.ACCEPT:
                feedback = "All quality criteria met. No corrective action needed."
            else:
                feedback = self.feedback_router.generate(report)

            iter_duration = time.monotonic() - iter_start
            result = IterationResult(
                iteration=i,
                report=report,
                decision=decision,
                feedback=feedback,
                summary=summary,
                duration_s=iter_duration,
            )
            loop.iterations.append(result)

            if on_iteration is not None:
                on_iteration(i, result)

            # Stop conditions
            if decision in (Decision.ACCEPT, Decision.ABORT_PLATEAU, Decision.ABORT_MAX_ITER, Decision.ABORT_LOW_COVERAGE):
                loop.final_decision = decision
                loop.final_mu = report.mu
                if decision == Decision.ABORT_LOW_COVERAGE:
                    loop.abort_reason = "Couverture insuffisante — executer le preflight d'abord"
                break

            # 4. Re-run phase with feedback
            if rerun_phase is not None:
                success = rerun_phase(self.phase, feedback, i)
                if not success:
                    loop.final_decision = Decision.ABORT_MAX_ITER
                    loop.final_mu = report.mu
                    loop.abort_reason = "rerun_phase callback returned False"
                    break
            else:
                # No rerun callback — just evaluate once
                loop.final_decision = decision
                loop.final_mu = report.mu
                break

        # Ensure final state is set
        if not loop.iterations:
            loop.final_decision = Decision.ABORT_MAX_ITER
        elif loop.final_decision == Decision.ITERATE:
            loop.final_decision = Decision.ABORT_MAX_ITER
            loop.final_mu = loop.iterations[-1].report.mu

        return loop
