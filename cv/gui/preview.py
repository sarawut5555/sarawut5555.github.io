"""
gui/preview.py - Live PDF preview with zoom and scroll support.
"""

from __future__ import annotations

import threading
from typing import Optional

import customtkinter as ctk
from PIL import Image, ImageTk

from data import ResumeData
from template import get_template
from utils import pdf_bytes_to_pil


class PreviewPanel(ctk.CTkFrame):
    """Scrollable live preview with zoom in/out controls."""

    ZOOM_MIN = 0.25
    ZOOM_MAX = 3.0
    ZOOM_STEP = 0.1

    def __init__(self, master, **kwargs) -> None:
        super().__init__(master, **kwargs)
        self._photo: Optional[ImageTk.PhotoImage] = None
        self._source_image: Optional[Image.Image] = None
        self._debounce_id: Optional[str] = None
        self._rendering = False
        self._zoom = 1.0
        self._fit_zoom = 1.0
        self._pending_data: Optional[ResumeData] = None

        self._build_toolbar()
        self._scroll = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self._scroll.pack(fill="both", expand=True, padx=4, pady=(0, 4))

        self._img_label = ctk.CTkLabel(self._scroll, text="Preview will appear here", text_color="gray")
        self._img_label.pack(anchor="nw", padx=4, pady=4)

        self._status = ctk.CTkLabel(self, text="", font=ctk.CTkFont(size=11))
        self._status.pack(pady=(0, 4))

        self._bind_zoom_events()

    def _build_toolbar(self) -> None:
        bar = ctk.CTkFrame(self, fg_color="transparent")
        bar.pack(fill="x", padx=4, pady=(4, 2))

        ctk.CTkButton(bar, text="-", width=36, command=self.zoom_out).pack(side="left", padx=2)
        self._zoom_label = ctk.CTkLabel(bar, text="100%", width=52)
        self._zoom_label.pack(side="left", padx=2)
        ctk.CTkButton(bar, text="+", width=36, command=self.zoom_in).pack(side="left", padx=2)
        ctk.CTkButton(bar, text="Fit", width=48, command=self.zoom_fit).pack(side="left", padx=6)
        ctk.CTkButton(bar, text="100%", width=48, command=self.zoom_actual).pack(side="left", padx=2)
        ctk.CTkLabel(bar, text="Scroll wheel = zoom", font=ctk.CTkFont(size=11), text_color="gray").pack(side="right", padx=4)

    def _bind_zoom_events(self) -> None:
        for widget in (self, self._scroll, self._img_label):
            widget.bind("<MouseWheel>", self._on_mousewheel)
            widget.bind("<Enter>", lambda _e: widget.focus_set())

    def _on_mousewheel(self, event) -> str:
        if event.delta > 0:
            self.zoom_in()
        elif event.delta < 0:
            self.zoom_out()
        return "break"

    def zoom_in(self) -> None:
        self._set_zoom(min(self.ZOOM_MAX, round(self._zoom + self.ZOOM_STEP, 2)))

    def zoom_out(self) -> None:
        self._set_zoom(max(self.ZOOM_MIN, round(self._zoom - self.ZOOM_STEP, 2)))

    def zoom_fit(self) -> None:
        self._compute_fit_zoom()
        self._set_zoom(self._fit_zoom)

    def zoom_actual(self) -> None:
        self._set_zoom(1.0)

    def _set_zoom(self, level: float) -> None:
        self._zoom = max(self.ZOOM_MIN, min(self.ZOOM_MAX, level))
        self._apply_zoom()

    def _compute_fit_zoom(self) -> None:
        if self._source_image is None:
            return
        panel_w = max(self.winfo_width() - 56, 200)
        self._fit_zoom = max(self.ZOOM_MIN, min(self.ZOOM_MAX, panel_w / self._source_image.width))

    def schedule_update(self, data: ResumeData, accent: str = "blue", delay_ms: int = 600) -> None:
        self._pending_data = data
        if self._debounce_id:
            self.after_cancel(self._debounce_id)
        self._debounce_id = self.after(delay_ms, lambda: self._render(data, accent))

    def _render(self, data: ResumeData, accent: str) -> None:
        if self._rendering:
            return
        self._rendering = True
        self._status.configure(text="Rendering preview...")

        def worker() -> None:
            try:
                template = get_template(data.template)
                pdf_bytes = template.build(data, accent=accent)
                img = pdf_bytes_to_pil(pdf_bytes, dpi=120)
                self.after(0, lambda: self._show_image(img))
            except Exception as exc:
                self.after(0, lambda: self._show_error(str(exc)))
            finally:
                self.after(0, lambda: setattr(self, "_rendering", False))

        threading.Thread(target=worker, daemon=True).start()

    def _show_image(self, img: Optional[Image.Image]) -> None:
        if img is None:
            self._source_image = None
            self._img_label.configure(text="Install PyMuPDF for live preview:\npip install pymupdf", image=None)
            self._status.configure(text="")
            return

        preserve_zoom = self._source_image is not None
        prev_zoom = self._zoom
        self._source_image = img
        self._compute_fit_zoom()
        self._zoom = prev_zoom if preserve_zoom else self._fit_zoom
        self._apply_zoom()
        self._status.configure(text="Live preview (page 1)")

    def _apply_zoom(self) -> None:
        if self._source_image is None:
            return

        new_w = max(1, int(self._source_image.width * self._zoom))
        new_h = max(1, int(self._source_image.height * self._zoom))
        resized = self._source_image.resize((new_w, new_h), Image.Resampling.LANCZOS)
        self._photo = ImageTk.PhotoImage(resized)
        self._img_label.configure(image=self._photo, text="")
        self._zoom_label.configure(text=f"{int(self._zoom * 100)}%")

    def _show_error(self, message: str) -> None:
        self._source_image = None
        self._img_label.configure(text=f"Preview error:\n{message}", image=None)
        self._status.configure(text="")
