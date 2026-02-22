"""SOIC v3.0 — Domain grid registry with phase-based gate selection."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Callable
    from ..gate_protocol import WebGate

_GATE_SET_REGISTRY: dict[str, Callable] = {}

_PHASE_GATE_MAP: dict[str, str] = {
    "ph0-discovery": "PHASE_EARLY",
    "ph1-strategy": "PHASE_EARLY",
    "ph2-design": "PHASE_EARLY",
    "ph3-content": "PHASE_EARLY",
    "ph4-build": "WEB_BUILD",
    "ph5-qa": "WEB_FULL",
}


def register_gate_set(name: str, loader_fn: Callable) -> None:
    """Register a named gate set loader."""
    _GATE_SET_REGISTRY[name.upper()] = loader_fn


def get_phase_gates(phase: str) -> list[WebGate]:
    """Return gate instances for the given phase."""
    gate_set_name = _PHASE_GATE_MAP.get(phase)
    if gate_set_name is None:
        raise ValueError(f"Unknown phase: {phase!r}. Available: {list(_PHASE_GATE_MAP)}")
    loader = _GATE_SET_REGISTRY.get(gate_set_name)
    if loader is None:
        raise ValueError(f"Gate set {gate_set_name!r} not registered. Available: {list(_GATE_SET_REGISTRY)}")
    return loader()
