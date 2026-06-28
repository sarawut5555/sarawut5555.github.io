"""
styles.py - Typography and layout constants matching the public resume style.

Single-column, black-and-white, ATS-friendly design inspired by
maythiwat.com resume layout (IBM Plex Sans, minimal rules).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class Theme:
    """Immutable layout and colour palette for PDF rendering."""

    # Page (A4)
    page_width: float = 595.27
    page_height: float = 841.89

    # Margins – measured from reference PDF
    margin_left: float = 57.6
    margin_right: float = 59.4
    margin_top: float = 47.0
    margin_bottom: float = 50.0

    # Typography (pt)
    size_name: float = 22.0
    size_section: float = 14.0
    size_body: float = 11.0
    line_height: float = 1.65          # ~18.2 pt per line at 11 pt
    section_gap: float = 11.0          # space before section title
    section_rule_gap: float = 10.0     # space below rule before content
    entry_gap: float = 8.0             # space between entries

    # Font families (registered in utils.register_fonts)
    font_regular: str = "Resume-Regular"
    font_bold: str = "Resume-Bold"

    # Colours
    text_primary: str = "#000000"
    text_link: str = "#666666"
    rule_color: str = "#000000"
    background: str = "#FFFFFF"

    @property
    def content_right(self) -> float:
        """Right edge of the content area."""
        return self.page_width - self.margin_right

    @property
    def content_width(self) -> float:
        """Usable text width."""
        return self.content_right - self.margin_left

    @property
    def bullet_indent(self) -> float:
        """Sub-bullet indent from left margin."""
        return 13.5


PUBLIC_THEME = Theme()


def get_theme(mode: str = "light", accent: str = "blue") -> Theme:
    """Return theme with registered font family names."""
    from utils import register_fonts

    regular, bold = register_fonts()
    return Theme(font_regular=regular, font_bold=bold)


# GUI themes (unchanged)
@dataclass
class GUITheme:
    mode: str = "dark"
    bg: str = "#1a1a2e"
    surface: str = "#16213e"
    surface_alt: str = "#0f3460"
    text: str = "#e8e8e8"
    text_muted: str = "#a0a0a0"
    accent: str = "#333333"
    accent_hover: str = "#111111"
    border: str = "#2a2a4a"
    success: str = "#10B981"
    danger: str = "#EF4444"


GUI_DARK = GUITheme()
GUI_LIGHT = GUITheme(
    mode="light",
    bg="#F1F5F9",
    surface="#FFFFFF",
    surface_alt="#E2E8F0",
    text="#1E293B",
    text_muted="#64748B",
    accent="#333333",
    accent_hover="#111111",
    border="#CBD5E1",
)

ACCENT_PALETTES: Dict[str, str] = {"default": "#000000"}


def get_gui_theme(mode: str = "dark") -> GUITheme:
    return GUI_LIGHT if mode.lower() == "light" else GUI_DARK
