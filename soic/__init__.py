"""NEXOS SOIC v3.0 — Quality Gate Engine

Convergence engine: evaluate -> decide -> feedback -> re-run
"""

# Core models
from .models import GateStatus, GateResult, SOICScore, PhaseGateReport

# Gate protocol
from .gate_protocol import WebGate

# Engine components
from .gate_engine import GateEngine
from .converger import Converger, Decision
from .feedback_router import FeedbackRouter
from .persistence import RunStore
from .iterator import PhaseIterator, LoopResult, IterationResult

# Dimensions (unchanged)
from .dimensions import DIMENSIONS, calculate_mu

# Auto-register domain grids on import
from .domain_grids import phase_early as _pe  # noqa: F401
from .domain_grids import web as _web  # noqa: F401

__all__ = [
    "GateStatus", "GateResult", "SOICScore", "PhaseGateReport",
    "WebGate", "GateEngine",
    "Converger", "Decision",
    "FeedbackRouter", "RunStore",
    "PhaseIterator", "LoopResult", "IterationResult",
    "DIMENSIONS", "calculate_mu",
]
