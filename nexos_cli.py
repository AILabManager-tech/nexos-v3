#!/usr/bin/env python3
"""NEXOS v3.0 CLI — thin wrapper around orchestrator.py."""
import os
import sys

sys.argv[0] = "nexos"
_here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _here)
os.chdir(_here)
exec(open(os.path.join(_here, "orchestrator.py")).read())
