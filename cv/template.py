"""
template.py - Public-style single-column resume template (PDF + HTML).

Matches the minimal black-and-white layout:
  - Centred name, links below name, contact line beneath
  - EDUCATION / EXPERIENCES / PROJECTS / SKILLS with horizontal rules
  - Bold titles, right-aligned dates, bullet sub-lists
"""

from __future__ import annotations

import io
from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from urllib.parse import urlparse

from reportlab.lib import colors
from reportlab.pdfgen import canvas

from data import ResumeData
from styles import Theme, get_theme
from utils import format_url_display, register_fonts, wrap_text_lines


TEMPLATE_REGISTRY: dict[str, type["BaseResumeTemplate"]] = {}


def register_template(cls: type["BaseResumeTemplate"]) -> type["BaseResumeTemplate"]:
    TEMPLATE_REGISTRY[cls.name] = cls
    return cls


def get_template(name: str) -> "BaseResumeTemplate":
    if name not in TEMPLATE_REGISTRY:
        raise ValueError(f"Unknown template: {name}. Available: {list(TEMPLATE_REGISTRY)}")
    return TEMPLATE_REGISTRY[name]()


def list_templates() -> List[str]:
    return list(TEMPLATE_REGISTRY.keys())


class BaseResumeTemplate(ABC):
    name: str = "base"
    label: str = "Base"

    def build(self, data: ResumeData, accent: str = "blue") -> bytes:
        register_fonts()
        theme = get_theme()
        buffer = io.BytesIO()
        self._render_pdf(data, theme, buffer)
        buffer.seek(0)
        return buffer.read()

    def build_html(self, data: ResumeData, accent: str = "blue") -> str:
        theme = get_theme()
        return self._render_html(data, theme)

    @abstractmethod
    def _render_pdf(self, data: ResumeData, theme: Theme, buffer: io.BytesIO) -> None:
        ...

    @abstractmethod
    def _render_html(self, data: ResumeData, theme: Theme) -> str:
        ...

    def _hex(self, colour: str) -> colors.Color:
        colour = colour.lstrip("#")
        r, g, b = (int(colour[i : i + 2], 16) / 255.0 for i in (0, 2, 4))
        return colors.Color(r, g, b)


@register_template
class PublicResumeTemplate(BaseResumeTemplate):
    """Single-column ATS-friendly resume matching resume-public.pdf style."""

    name = "public"
    label = "Public Minimal"
    ats_friendly = True

    def _render_pdf(self, data: ResumeData, theme: Theme, buffer: io.BytesIO) -> None:
        c = canvas.Canvas(buffer, pagesize=(theme.page_width, theme.page_height))
        c.setFillColor(self._hex(theme.background))
        c.rect(0, 0, theme.page_width, theme.page_height, fill=1, stroke=0)

        y = theme.page_height - theme.margin_top
        y = self._draw_header(c, data, theme, y)

        for section in data.section_order:
            if section == "education" and data.education:
                y = self._draw_section(c, theme, y, "EDUCATION")
                y = self._draw_education(c, data, theme, y)
            elif section == "experience" and data.experience:
                y = self._draw_section(c, theme, y, "EXPERIENCES")
                y = self._draw_experience(c, data, theme, y)
            elif section == "projects" and data.projects:
                y = self._draw_section(c, theme, y, "PROJECTS")
                y = self._draw_projects(c, data, theme, y)
            elif section == "skills" and (data.tech_stack or data.languages):
                y = self._draw_section(c, theme, y, "SKILLS")
                y = self._draw_skills(c, data, theme, y)

        c.showPage()
        c.save()

    # ------------------------------------------------------------------
    # Header
    # ------------------------------------------------------------------

    def _draw_header(self, c: canvas.Canvas, data: ResumeData, theme: Theme, y: float) -> float:
        contact = data.contact
        center_x = theme.page_width / 2
        line_h = theme.size_body * theme.line_height

        # Name – centred
        c.setFillColor(self._hex(theme.text_primary))
        c.setFont(theme.font_bold, theme.size_name)
        name_baseline = y - theme.size_name * 0.75
        c.drawCentredString(center_x, name_baseline, contact.full_name)
        y -= theme.size_name * 1.15

        # Links – centred row below name
        links: List[Tuple[str, str]] = []
        for link in contact.links:
            if link.url:
                links.append((format_url_display(link.url), link.url))
        if not links:
            for url in (contact.linkedin, contact.github, contact.portfolio):
                if url:
                    links.append((format_url_display(url), url))

        if links:
            y = self._draw_centered_link_row(c, links, y, theme)
            y -= 4

        # Contact line – centred: location | email | phone
        parts = [p for p in [contact.location, contact.email, contact.phone] if p]
        if parts:
            contact_line = "  |  ".join(parts)
            c.setFillColor(self._hex(theme.text_primary))
            c.setFont(theme.font_regular, theme.size_body)
            c.drawCentredString(center_x, y - theme.size_body * 0.8, contact_line)
            y -= line_h

        return y - theme.section_gap

    def _draw_centered_link_row(
        self,
        c: canvas.Canvas,
        links: List[Tuple[str, str]],
        y: float,
        theme: Theme,
    ) -> float:
        """Draw hyperlinks in one centred row separated by |."""
        sep = "  |  "
        c.setFont(theme.font_regular, theme.size_body)
        baseline = y - theme.size_body * 0.8

        total_w = 0
        sep_w = c.stringWidth(sep, theme.font_regular, theme.size_body)
        widths = []
        for display, _url in links:
            tw = c.stringWidth(display, theme.font_regular, theme.size_body)
            widths.append(tw)
            total_w += tw
        total_w += sep_w * max(0, len(links) - 1)

        x = (theme.page_width - total_w) / 2
        for i, (display, url) in enumerate(links):
            if i > 0:
                c.setFillColor(self._hex(theme.text_primary))
                c.drawString(x, baseline, sep)
                x += sep_w

            c.setFillColor(self._hex(theme.text_link))
            tw = widths[i]
            c.drawString(x, baseline, display)
            c.setStrokeColor(self._hex(theme.text_link))
            c.setLineWidth(0.5)
            c.line(x, baseline - 2, x + tw, baseline - 2)
            if url:
                c.linkURL(url, (x, baseline - 4, x + tw, baseline + theme.size_body), relative=0)
            x += tw

        return y - theme.size_body * theme.line_height

    def _draw_link(
        self,
        c: canvas.Canvas,
        text: str,
        url: str,
        right_x: float,
        y: float,
        theme: Theme,
        underline: bool = True,
    ) -> None:
        """Draw a right-aligned hyperlink (legacy helper)."""
        c.setFillColor(self._hex(theme.text_link))
        c.setFont(theme.font_regular, theme.size_body)
        tw = c.stringWidth(text, theme.font_regular, theme.size_body)
        x = right_x - tw
        baseline = y - theme.size_body * 0.8
        c.drawString(x, baseline, text)
        if underline:
            c.setStrokeColor(self._hex(theme.text_link))
            c.setLineWidth(0.5)
            c.line(x, baseline - 2, right_x, baseline - 2)
        if url:
            c.linkURL(url, (x, baseline - 4, right_x, baseline + theme.size_body), relative=0)

    # ------------------------------------------------------------------
    # Section helpers
    # ------------------------------------------------------------------

    def _draw_section(self, c: canvas.Canvas, theme: Theme, y: float, title: str) -> float:
        y -= theme.section_gap
        c.setFillColor(self._hex(theme.text_primary))
        c.setFont(theme.font_bold, theme.size_section)
        c.drawString(theme.margin_left, y - theme.size_section * 0.8, title)

        rule_y = y - theme.size_section - 2
        c.setStrokeColor(self._hex(theme.rule_color))
        c.setLineWidth(0.75)
        c.line(theme.margin_left, rule_y, theme.content_right, rule_y)

        return rule_y - theme.section_rule_gap

    def _draw_right_date(self, c: canvas.Canvas, date: str, y: float, theme: Theme) -> None:
        if not date:
            return
        c.setFillColor(self._hex(theme.text_primary))
        c.setFont(theme.font_bold, theme.size_body)
        c.drawRightString(theme.content_right, y - theme.size_body * 0.8, date)

    def _draw_wrapped(
        self,
        c: canvas.Canvas,
        text: str,
        x: float,
        y: float,
        max_width: float,
        theme: Theme,
        bold: bool = False,
    ) -> float:
        font = theme.font_bold if bold else theme.font_regular
        c.setFont(font, theme.size_body)
        c.setFillColor(self._hex(theme.text_primary))
        line_h = theme.size_body * theme.line_height
        for line in wrap_text_lines(text, max_width, theme.size_body, font):
            if line == "":
                y -= line_h * 0.6
                continue
            c.drawString(x, y - theme.size_body * 0.8, line)
            y -= line_h
        return y

    def _draw_project_bullet(self, c: canvas.Canvas, name: str, theme: Theme, y: float) -> float:
        """Draw bullet marker + bold project name."""
        line_h = theme.size_body * theme.line_height
        marker = "\u25cf "
        x = theme.margin_left
        baseline = y - theme.size_body * 0.8

        c.setFont(theme.font_regular, theme.size_body)
        c.setFillColor(self._hex(theme.text_primary))
        c.drawString(x, baseline, marker)
        mx = c.stringWidth(marker, theme.font_regular, theme.size_body)

        c.setFont(theme.font_bold, theme.size_body)
        lines = wrap_text_lines(name, theme.content_width - mx, theme.size_body, theme.font_bold)
        for i, line in enumerate(lines):
            if i > 0:
                y -= line_h
                baseline = y - theme.size_body * 0.8
            c.drawString(x + (mx if i == 0 else theme.bullet_indent), baseline, line)
        return y - line_h

    # ------------------------------------------------------------------
    # Sections
    # ------------------------------------------------------------------

    def _draw_education(self, c: canvas.Canvas, data: ResumeData, theme: Theme, y: float) -> float:
        line_h = theme.size_body * theme.line_height
        for edu in data.education:
            c.setFont(theme.font_bold, theme.size_body)
            c.setFillColor(self._hex(theme.text_primary))
            
            # Calculate maximum width for degree to not overlap with duration
            date_width = c.stringWidth(edu.duration, theme.font_bold, theme.size_body) if edu.duration else 0
            degree_max_width = theme.content_width - date_width - 15
            
            # Draw duration on the first line's y level
            self._draw_right_date(c, edu.duration, y, theme)
            
            # Draw wrapped degree lines
            degree_lines = wrap_text_lines(edu.degree, degree_max_width, theme.size_body, theme.font_bold)
            for line in degree_lines:
                c.drawString(theme.margin_left, y - theme.size_body * 0.8, line)
                y -= line_h
            
            # Draw Institution (University/College) below degree
            if edu.institution:
                c.setFont(theme.font_regular, theme.size_body)
                c.setFillColor(self._hex(theme.text_primary))
                inst_lines = wrap_text_lines(edu.institution, theme.content_width, theme.size_body, theme.font_regular)
                for line in inst_lines:
                    c.drawString(theme.margin_left, y - theme.size_body * 0.8, line)
                    y -= line_h

            gpa_parts = []
            if edu.gpa:
                gpa_parts.append(f"GPA: {edu.gpa}")
            if edu.gpax:
                gpa_parts.append(f"GPAX: {edu.gpax}")
            if gpa_parts:
                c.setFont(theme.font_regular, theme.size_body)
                c.setFillColor(self._hex(theme.text_primary))
                c.drawString(theme.margin_left, y - theme.size_body * 0.8, "  |  ".join(gpa_parts))
                y -= line_h

        return y - theme.entry_gap

    def _draw_experience(self, c: canvas.Canvas, data: ResumeData, theme: Theme, y: float) -> float:
        line_h = theme.size_body * theme.line_height

        for exp in data.experience:
            c.setFont(theme.font_bold, theme.size_body)
            c.setFillColor(self._hex(theme.text_primary))
            c.drawString(theme.margin_left, y - theme.size_body * 0.8, exp.title)
            self._draw_right_date(c, exp.duration, y, theme)
            y -= line_h

            if exp.description:
                y = self._draw_wrapped(
                    c, exp.description, theme.margin_left, y,
                    theme.content_width, theme,
                )

            if exp.selected_projects:
                y = self._draw_wrapped(
                    c, "Selected Projects:", theme.margin_left, y,
                    theme.content_width, theme,
                )
                for proj in exp.selected_projects:
                    y = self._draw_project_bullet(c, proj.name, theme, y)
                    indent = theme.margin_left + theme.bullet_indent
                    for sub in proj.bullets:
                        y = self._draw_wrapped(c, sub, indent, y, theme.content_width - theme.bullet_indent, theme)

            for bullet in exp.bullets:
                y = self._draw_wrapped(
                    c, bullet, theme.margin_left, y, theme.content_width, theme,
                )

            y -= theme.entry_gap

        return y

    def _draw_projects(self, c: canvas.Canvas, data: ResumeData, theme: Theme, y: float) -> float:
        line_h = theme.size_body * theme.line_height

        for proj in data.projects:
            if proj.name:
                c.setFont(theme.font_bold, theme.size_body)
                c.setFillColor(self._hex(theme.text_primary))
                c.drawString(theme.margin_left, y - theme.size_body * 0.8, proj.name)
                y -= line_h

            if proj.description:
                y = self._draw_wrapped(
                    c, proj.description, theme.margin_left, y,
                    theme.content_width, theme,
                )

            if proj.link:
                url = proj.link if proj.link.startswith("http") else f"https://{proj.link}"
                display = format_url_display(proj.link)
                c.setFillColor(self._hex(theme.text_link))
                c.setFont(theme.font_regular, theme.size_body)
                baseline = y - theme.size_body * 0.8
                tw = c.stringWidth(display, theme.font_regular, theme.size_body)
                c.drawString(theme.margin_left, baseline, display)
                c.setStrokeColor(self._hex(theme.text_link))
                c.setLineWidth(0.5)
                c.line(theme.margin_left, baseline - 2, theme.margin_left + tw, baseline - 2)
                c.linkURL(url, (theme.margin_left, baseline - 4, theme.margin_left + tw, baseline + theme.size_body), relative=0)
                y -= line_h

            y -= theme.entry_gap * 0.5

        return y - theme.entry_gap

    def _draw_skills(self, c: canvas.Canvas, data: ResumeData, theme: Theme, y: float) -> float:
        line_h = theme.size_body * theme.line_height

        if data.tech_stack:
            prefix = "Tech Stack: "
            c.setFont(theme.font_bold, theme.size_body)
            pw = c.stringWidth(prefix, theme.font_bold, theme.size_body)
            c.setFillColor(self._hex(theme.text_primary))
            c.drawString(theme.margin_left, y - theme.size_body * 0.8, prefix)

            remaining = theme.content_width - pw
            lines = wrap_text_lines(data.tech_stack, remaining, theme.size_body, theme.font_regular)
            c.setFont(theme.font_regular, theme.size_body)
            if lines:
                c.drawString(theme.margin_left + pw, y - theme.size_body * 0.8, lines[0])
                y -= line_h
                for line in lines[1:]:
                    c.drawString(theme.margin_left, y - theme.size_body * 0.8, line)
                    y -= line_h
            else:
                y -= line_h

        if data.languages:
            lang_text = ", ".join(
                f"{lang.name} ({lang.level})" if lang.level else lang.name
                for lang in data.languages
            )
            prefix = "Languages: "
            c.setFont(theme.font_bold, theme.size_body)
            c.drawString(theme.margin_left, y - theme.size_body * 0.8, prefix + lang_text)
            y -= line_h

        return y

    # ------------------------------------------------------------------
    # HTML preview
    # ------------------------------------------------------------------

    def _render_html(self, data: ResumeData, theme: Theme) -> str:
        c = data.contact

        def html_text(text: str) -> str:
            from html import escape
            return "<br>".join(escape(line) for line in text.splitlines())

        def link_html(url: str) -> str:
            if not url:
                return ""
            display = format_url_display(url)
            return f'<a href="{url}">{display}</a>'

        header_links = c.links or [
            type("L", (), {"url": u})() for u in (c.linkedin, c.github, c.portfolio) if u
        ]
        links_html = "".join(
            link_html(link.url) + "<br>"
            for link in header_links
            if getattr(link, "url", "")
        )

        edu_html = "".join(
            f'<div class="row"><span class="bold">{e.degree}, {e.institution}</span>'
            f'<span class="date">{e.duration}</span></div>'
            + (
                f'<p class="gpa">{"  |  ".join(p for p in [f"GPA: {e.gpa}" if e.gpa else "", f"GPAX: {e.gpax}" if e.gpax else ""] if p)}</p>'
                if e.gpa or e.gpax else ""
            )
            for e in data.education
        )

        exp_html = ""
        for exp in data.experience:
            subs = ""
            if exp.selected_projects:
                subs = '<p class="subhead">Selected Projects:</p><ul>'
                for p in exp.selected_projects:
                    subs += f"<li><strong>{p.name}</strong><ul>"
                    subs += "".join(f"<li>{b}</li>" for b in p.bullets)
                    subs += "</ul></li>"
                subs += "</ul>"
            bullets = "".join(f"<li>{b}</li>" for b in exp.bullets)
            exp_html += f"""
            <div class="exp">
              <div class="row"><span class="bold">{exp.title}</span><span class="date">{exp.duration}</span></div>
              <p>{html_text(exp.description)}</p>{subs}<ul>{bullets}</ul>
            </div>"""

        proj_html = "".join(
            f'<p><strong>{p.name}</strong><br>{html_text(p.description)}'
            f'{"<br>" + link_html(p.link if p.link.startswith("http") else "https://" + p.link) if p.link else ""}'
            f'</p>'
            for p in data.projects
        )

        langs = ", ".join(f"{l.name} ({l.level})" for l in data.languages)

        return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{c.full_name}</title>
<style>
  body {{ font-family: Helvetica, Arial, sans-serif; max-width: 210mm; margin: 2rem auto; color: #000; font-size: 11pt; line-height: 1.65; }}
  h1 {{ font-size: 22pt; margin: 0 0 6px; }}
  .header {{ text-align: center; margin-bottom: 1rem; }}
  .links {{ margin: 4px 0; }}
  .links a {{ color: #666; text-decoration: underline; margin: 0 4px; }}
  .contact {{ color: #000; margin-top: 4px; }}
  .gpa {{ font-size: 11pt; margin: 0 0 6px; }}
  h2 {{ font-size: 14pt; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px; margin: 1rem 0 0.6rem; }}
  .row {{ display: flex; justify-content: space-between; gap: 1rem; }}
  .bold {{ font-weight: bold; }}
  .date {{ font-weight: bold; white-space: nowrap; }}
  ul {{ margin: 0.2rem 0 0.5rem 1.2rem; padding: 0; }}
  .subhead {{ margin: 0.3rem 0; }}
  a {{ color: #666; }}
</style></head><body>
<div class="header">
  <h1>{c.full_name}</h1>
  <div class="links">{links_html.replace("<br>", " | ")}</div>
  <p class="contact">{c.location} &nbsp;|&nbsp; {c.email} &nbsp;|&nbsp; {c.phone}</p>
</div>
<h2>Education</h2>{edu_html}
<h2>Experiences</h2>{exp_html}
<h2>Projects</h2>{proj_html}
<h2>Skills</h2>
<p><strong>Tech Stack:</strong> {data.tech_stack}</p>
<p><strong>Languages:</strong> {langs}</p>
</body></html>"""


def export_pdf(data: ResumeData, output_path: str, accent: str = "blue") -> str:
    template = get_template(data.template)
    pdf_bytes = template.build(data, accent=accent)
    from pathlib import Path

    dest = Path(output_path)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(pdf_bytes)
    return str(dest.resolve())


def preview_html(data: ResumeData, accent: str = "blue") -> str:
    template = get_template(data.template)
    return template.build_html(data, accent=accent)
