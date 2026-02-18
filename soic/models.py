"""SOIC v3.0 — Core data models for NEXOS quality gates."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any


class GateStatus(str, Enum):
    """Result status of a quality gate execution."""

    PASS = "PASS"
    FAIL = "FAIL"
    SKIP = "SKIP"
    ERROR = "ERROR"
    NOT_EXECUTED = "NOT_EXECUTED"


@dataclass
class GateResult:
    """Result of a single gate execution.

    Unlike AINOVA's binary PASS/FAIL, NEXOS gates produce granular scores
    (0.0-10.0) because web metrics are continuous (e.g. Lighthouse 0.73 = 7.3).

    NOT_EXECUTED gates score 0.0 (not 5.0) to avoid inflating mu.
    """

    gate_id: str
    name: str
    dimension: str  # D1-D9
    status: GateStatus
    score: float  # 0.0-10.0
    evidence: str
    duration_ms: int
    command: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "gate_id": self.gate_id,
            "name": self.name,
            "dimension": self.dimension,
            "status": self.status.value,
            "score": round(self.score, 2),
            "evidence": self.evidence,
            "duration_ms": self.duration_ms,
            "command": self.command,
        }


@dataclass
class SOICScore:
    """Computed SOIC score from gate results."""

    mu: float
    dimension_scores: dict[str, float]
    pass_rate: float
    total_gates: int
    passed: int
    failed: int
    skipped: int
    not_executed: int
    coverage: float  # gates actually executed / total
    failures: list[str]

    def to_dict(self) -> dict[str, Any]:
        return {
            "mu": round(self.mu, 2),
            "dimension_scores": {k: round(v, 2) for k, v in self.dimension_scores.items()},
            "pass_rate": round(self.pass_rate, 3),
            "total_gates": self.total_gates,
            "passed": self.passed,
            "failed": self.failed,
            "skipped": self.skipped,
            "not_executed": self.not_executed,
            "coverage": round(self.coverage, 3),
            "failures": self.failures,
        }


@dataclass
class PhaseGateReport:
    """Full report from a gate engine run for a specific phase."""

    run_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    phase: str = ""
    client_slug: str = ""
    iteration: int = 1
    gates: list[GateResult] = field(default_factory=list)
    dimension_scores: dict[str, float] = field(default_factory=dict)
    mu: float = 0.0
    coverage: float = 1.0
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @property
    def fail_count(self) -> int:
        """Number of FAIL + ERROR gates."""
        return sum(1 for g in self.gates if g.status in (GateStatus.FAIL, GateStatus.ERROR))

    def compute_score(self) -> SOICScore:
        """Aggregate gate scores by dimension, then compute mu via calculate_mu().

        NOT_EXECUTED gates count as 0.0 (not 5.0) — they penalize the score.
        SKIP gates are excluded from scoring (neutral).
        Coverage = executed gates / total gates. If < 0.7 → INCOMPLETE.
        """
        from .dimensions import calculate_mu, DIMENSIONS

        # Count statuses
        not_executed = sum(1 for g in self.gates if g.status == GateStatus.NOT_EXECUTED)
        skipped = sum(1 for g in self.gates if g.status == GateStatus.SKIP)
        executed = len(self.gates) - skipped  # NOT_EXECUTED counts as "attempted but no data"
        actually_ran = len(self.gates) - skipped - not_executed

        # Coverage: proportion of gates that actually ran (not skipped, not NOT_EXECUTED)
        self.coverage = actually_ran / len(self.gates) if self.gates else 0.0

        # Group scores by dimension
        # SKIP = excluded, NOT_EXECUTED = 0.0 (penalizing)
        dim_scores: dict[str, list[float]] = {}
        for g in self.gates:
            if g.status == GateStatus.SKIP:
                continue
            if g.status == GateStatus.NOT_EXECUTED:
                dim_scores.setdefault(g.dimension, []).append(0.0)
            else:
                dim_scores.setdefault(g.dimension, []).append(g.score)

        # Average per dimension, 5.0 neutral only for dimensions with zero gates
        self.dimension_scores = {}
        for dim_id in DIMENSIONS:
            scores = dim_scores.get(dim_id, [])
            self.dimension_scores[dim_id] = (
                sum(scores) / len(scores) if scores else 5.0
            )

        self.mu = calculate_mu(self.dimension_scores)

        # Stats
        passed = sum(1 for g in self.gates if g.status == GateStatus.PASS)
        failed = sum(1 for g in self.gates if g.status in (GateStatus.FAIL, GateStatus.ERROR))
        failures = [g.gate_id for g in self.gates if g.status in (GateStatus.FAIL, GateStatus.ERROR)]

        return SOICScore(
            mu=self.mu,
            dimension_scores=dict(self.dimension_scores),
            pass_rate=passed / actually_ran if actually_ran > 0 else 0.0,
            total_gates=len(self.gates),
            passed=passed,
            failed=failed,
            skipped=skipped,
            not_executed=not_executed,
            coverage=self.coverage,
            failures=failures,
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "run_id": self.run_id,
            "phase": self.phase,
            "client_slug": self.client_slug,
            "iteration": self.iteration,
            "gates": [g.to_dict() for g in self.gates],
            "dimension_scores": {k: round(v, 2) for k, v in self.dimension_scores.items()},
            "mu": round(self.mu, 2),
            "coverage": round(self.coverage, 3),
            "timestamp": self.timestamp,
        }
