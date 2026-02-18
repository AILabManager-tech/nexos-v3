"""Tests for soic.converger — Decision engine with blocking dims, plateau, coverage."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from soic.models import GateStatus, GateResult, PhaseGateReport
from soic.converger import Converger, Decision


def _gate(gate_id: str, dim: str, status: GateStatus, score: float) -> GateResult:
    return GateResult(
        gate_id=gate_id, name=f"test-{gate_id}", dimension=dim,
        status=status, score=score, evidence="test", duration_ms=0, command="",
    )


def _make_report(gates: list[GateResult], phase: str = "ph5-qa") -> PhaseGateReport:
    """Build a report and compute its score."""
    report = PhaseGateReport(phase=phase)
    report.gates = gates
    report.compute_score()
    return report


class TestConvergerAccept:
    def test_all_pass_high_mu_accepts(self):
        """All PASS + mu >= threshold → ACCEPT."""
        conv = Converger(phase="ph5-qa", max_iter=4)
        report = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-02", "D2", GateStatus.PASS, 10.0),
            _gate("W-03", "D3", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.PASS, 10.0),
            _gate("W-08", "D5", GateStatus.PASS, 10.0),
            _gate("W-10", "D6", GateStatus.PASS, 10.0),
            _gate("W-12", "D7", GateStatus.PASS, 10.0),
            _gate("W-14", "D8", GateStatus.PASS, 10.0),
            _gate("W-15", "D9", GateStatus.PASS, 10.0),
        ])
        assert report.mu >= 8.5
        decision = conv.decide(report, iteration=1)
        assert decision == Decision.ACCEPT


class TestConvergerBlocking:
    def test_d4_fail_blocks_accept(self):
        """D4 FAIL + high mu → NOT ACCEPT (blocking dimension)."""
        conv = Converger(phase="ph5-qa", max_iter=4)
        report = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-02", "D2", GateStatus.PASS, 10.0),
            _gate("W-03", "D3", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 3.0),
            _gate("W-08", "D5", GateStatus.PASS, 10.0),
            _gate("W-10", "D6", GateStatus.PASS, 10.0),
            _gate("W-12", "D7", GateStatus.PASS, 10.0),
            _gate("W-14", "D8", GateStatus.PASS, 10.0),
            _gate("W-15", "D9", GateStatus.PASS, 10.0),
        ])
        decision = conv.decide(report, iteration=1)
        assert decision != Decision.ACCEPT

    def test_d8_fail_blocks_accept(self):
        """D8 FAIL + high mu → NOT ACCEPT (blocking dimension)."""
        conv = Converger(phase="ph5-qa", max_iter=4)
        report = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-02", "D2", GateStatus.PASS, 10.0),
            _gate("W-03", "D3", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.PASS, 10.0),
            _gate("W-08", "D5", GateStatus.PASS, 10.0),
            _gate("W-10", "D6", GateStatus.PASS, 10.0),
            _gate("W-12", "D7", GateStatus.PASS, 10.0),
            _gate("W-14", "D8", GateStatus.FAIL, 2.0),
            _gate("W-15", "D9", GateStatus.PASS, 10.0),
        ])
        decision = conv.decide(report, iteration=1)
        assert decision != Decision.ACCEPT


class TestConvergerCoverage:
    def test_low_coverage_aborts(self):
        """Coverage < 0.7 → ABORT_LOW_COVERAGE."""
        conv = Converger(phase="ph5-qa", max_iter=4)
        # 1 PASS + 3 NOT_EXECUTED → coverage = 1/4 = 0.25
        report = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-08", "D5", GateStatus.NOT_EXECUTED, 0.0),
            _gate("W-10", "D6", GateStatus.NOT_EXECUTED, 0.0),
            _gate("W-11", "D6", GateStatus.NOT_EXECUTED, 0.0),
        ])
        assert report.coverage < 0.7
        decision = conv.decide(report, iteration=1)
        assert decision == Decision.ABORT_LOW_COVERAGE


class TestConvergerPlateau:
    def test_plateau_detected(self):
        """mu stagnant + same fail count → ABORT_PLATEAU."""
        conv = Converger(phase="ph5-qa", max_iter=4)

        # Iteration 1: mu=5.0, 1 fail
        report1 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 0.0),
        ])
        decision1 = conv.decide(report1, iteration=1)
        assert decision1 == Decision.ITERATE

        # Iteration 2: same mu, same fail count → plateau
        report2 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 0.0),
        ])
        decision2 = conv.decide(report2, iteration=2)
        assert decision2 == Decision.ABORT_PLATEAU

    def test_stagnant_mu_fewer_fails_continues(self):
        """mu stagnant but fewer failures → NOT plateau (qualitative progress)."""
        conv = Converger(phase="ph5-qa", max_iter=4)

        # Iteration 1: 2 fails
        report1 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 0.0),
            _gate("W-06", "D4", GateStatus.FAIL, 0.0),
        ])
        conv.decide(report1, iteration=1)

        # Iteration 2: same mu but only 1 fail → not plateau
        report2 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 0.0),
            _gate("W-06", "D4", GateStatus.PASS, 5.0),
        ])
        decision2 = conv.decide(report2, iteration=2)
        assert decision2 != Decision.ABORT_PLATEAU


class TestConvergerMaxIter:
    def test_max_iter_abort(self):
        """Reaching max_iter → ABORT_MAX_ITER."""
        conv = Converger(phase="ph5-qa", max_iter=2)

        report1 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 2.0),
        ])
        decision1 = conv.decide(report1, iteration=1)
        assert decision1 == Decision.ITERATE

        # Same but iteration=2 (max)
        report2 = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
            _gate("W-05", "D4", GateStatus.FAIL, 3.0),
        ])
        decision2 = conv.decide(report2, iteration=2)
        assert decision2 in (Decision.ABORT_MAX_ITER, Decision.ABORT_PLATEAU)


class TestConvergerSummary:
    def test_summary_not_empty(self):
        """get_summary should return a non-empty string."""
        conv = Converger(phase="ph5-qa")
        report = _make_report([
            _gate("W-01", "D1", GateStatus.PASS, 10.0),
        ])
        decision = conv.decide(report, iteration=1)
        summary = conv.get_summary(decision, iteration=1)
        assert len(summary) > 0
        assert "μ=" in summary or "coverage" in summary.lower()
