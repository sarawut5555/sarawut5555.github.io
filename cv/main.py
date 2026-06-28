#!/usr/bin/env python3
"""Resume Builder – public minimal style."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from data import ResumeData, sample_resume
from template import export_pdf
from utils import ensure_directories, OUTPUT_DIR


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Public-style Resume Builder")
    parser.add_argument("--export", action="store_true", help="Export PDF (no GUI)")
    parser.add_argument("-i", "--input", default="", help="Input JSON file")
    parser.add_argument("-o", "--output", default="", help="Output PDF path")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.export:
        ensure_directories()
        data = ResumeData.load_json(args.input) if args.input else sample_resume()
        out = args.output or str(OUTPUT_DIR / "resume.pdf")
        print(f"PDF exported: {export_pdf(data, out)}")
        return 0
    from gui.app import run_app
    run_app()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
