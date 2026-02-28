#!/usr/bin/env python3
"""NEXOS v4.0 CLI — thin wrapper around orchestrator.py."""
import os
import sys

sys.argv[0] = "nexos"
# Resolve symlinks to find the real NEXOS directory
_here = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, _here)
os.chdir(_here)
exec(open(os.path.join(_here, "orchestrator.py")).read())
