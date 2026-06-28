"""
utils.py - Font registration, text wrapping, and PDF preview helpers.
"""

from __future__ import annotations

import io
import textwrap
from pathlib import Path
from typing import List, Optional, Tuple

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None  # type: ignore

PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_ROOT / "output"
ASSETS_DIR = PROJECT_ROOT / "assets"
DATA_DIR = PROJECT_ROOT / "data"
FONTS_DIR = ASSETS_DIR / "fonts"

_FONT_REGULAR = "Helvetica"
_FONT_BOLD = "Helvetica-Bold"
_FONTS_REGISTERED = False


def ensure_directories() -> None:
    for folder in (OUTPUT_DIR, ASSETS_DIR, DATA_DIR, FONTS_DIR):
        folder.mkdir(parents=True, exist_ok=True)


def register_fonts() -> Tuple[str, str]:
    """
    Register IBM Plex Sans (or similar) if present in assets/fonts/.

    Falls back to Helvetica when custom fonts are unavailable.
    """
    global _FONT_REGULAR, _FONT_BOLD, _FONTS_REGISTERED
    if _FONTS_REGISTERED:
        return _FONT_REGULAR, _FONT_BOLD

    ensure_directories()
    candidates = [
        (FONTS_DIR / "IBMPlexSans-Regular.ttf", FONTS_DIR / "IBMPlexSans-Bold.ttf"),
        (FONTS_DIR / "IBMPlexSansThai-Regular.ttf", FONTS_DIR / "IBMPlexSansThai-Bold.ttf"),
    ]

    try:
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont

        for regular_path, bold_path in candidates:
            if regular_path.is_file() and bold_path.is_file():
                pdfmetrics.registerFont(TTFont("Resume-Regular", str(regular_path)))
                pdfmetrics.registerFont(TTFont("Resume-Bold", str(bold_path)))
                _FONT_REGULAR = "Resume-Regular"
                _FONT_BOLD = "Resume-Bold"
                break
    except Exception:
        pass

    _FONTS_REGISTERED = True
    return _FONT_REGULAR, _FONT_BOLD


def wrap_text_lines(
    text: str,
    max_width: float,
    font_size: float,
    font_name: str = "Helvetica",
) -> List[str]:
    """Word-wrap text; honour explicit newline characters."""
    if not text:
        return []

    from reportlab.pdfbase import pdfmetrics

    result: List[str] = []
    for paragraph in text.splitlines():
        paragraph = paragraph.rstrip()
        if not paragraph:
            result.append("")
            continue

        words = paragraph.split()
        current: List[str] = []
        for word in words:
            trial = " ".join(current + [word])
            width = pdfmetrics.stringWidth(trial, font_name, font_size)
            if width <= max_width or not current:
                current.append(word)
            else:
                result.append(" ".join(current))
                current = [word]
        if current:
            result.append(" ".join(current))
    return result


def truncate_text(text: str, max_chars: int) -> str:
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1] + "\u2026"


def format_url_display(url: str, max_len: int = 80) -> str:
    if not url:
        return ""
    display = url.replace("https://", "").replace("http://", "").rstrip("/")
    return truncate_text(display, max_len)


def pdf_bytes_to_pil(pdf_bytes: bytes, dpi: int = 120) -> Optional["Image.Image"]:
    if fitz is None:
        return None
    from PIL import Image

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    if doc.page_count == 0:
        return None
    page = doc[0]
    matrix = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    doc.close()
    return img

