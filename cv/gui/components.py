"""
gui/components.py - Form widgets for the public resume layout.
"""

from __future__ import annotations

from typing import Callable, List, Optional

import customtkinter as ctk
from tkinter import filedialog


class LabelledEntry(ctk.CTkFrame):
    def __init__(self, master, label: str, placeholder: str = "", **kwargs) -> None:
        super().__init__(master, fg_color="transparent", **kwargs)
        ctk.CTkLabel(self, text=label, anchor="w", font=ctk.CTkFont(size=12)).pack(fill="x")
        self.entry = ctk.CTkEntry(self, placeholder_text=placeholder)
        self.entry.pack(fill="x", pady=(2, 6))

    def get(self) -> str:
        return self.entry.get().strip()

    def set(self, value: str) -> None:
        self.entry.delete(0, "end")
        self.entry.insert(0, value or "")


class LabelledTextbox(ctk.CTkFrame):
    def __init__(self, master, label: str, height: int = 80, **kwargs) -> None:
        super().__init__(master, fg_color="transparent", **kwargs)
        ctk.CTkLabel(self, text=label, anchor="w", font=ctk.CTkFont(size=12)).pack(fill="x")
        self.textbox = ctk.CTkTextbox(self, height=height)
        self.textbox.pack(fill="x", pady=(2, 6))

    def get(self) -> str:
        return self.textbox.get("1.0", "end").strip()

    def set(self, value: str) -> None:
        self.textbox.delete("1.0", "end")
        self.textbox.insert("1.0", value or "")


class DynamicListEditor(ctk.CTkScrollableFrame):
    """Scrollable list of editable cards with add/remove.

    field_defs third value:
      False / "entry"   – single-line entry
      True  / "lines"   – multiline, stored as list of lines
      "textarea"        – multiline, stored as string with newlines
    """

    @staticmethod
    def _field_kind(spec) -> str:
        if spec in (True, "lines"):
            return "lines"
        if spec == "textarea":
            return "textarea"
        return "entry"

    def __init__(
        self,
        master,
        title: str,
        field_defs: List[tuple],
        on_change: Optional[Callable] = None,
        **kwargs,
    ) -> None:
        super().__init__(master, **kwargs)
        self._field_defs = field_defs
        self._on_change = on_change
        self._cards: List[dict] = []

        header = ctk.CTkFrame(self, fg_color="transparent")
        header.pack(fill="x", pady=(0, 4))
        ctk.CTkLabel(header, text=title, font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        ctk.CTkButton(header, text="+ Add", width=60, command=self.add_item).pack(side="right")

    def _notify(self) -> None:
        if self._on_change:
            self._on_change()

    def add_item(self, data: Optional[dict] = None) -> None:
        data = data or {}
        card = ctk.CTkFrame(self, corner_radius=8)
        card.pack(fill="x", pady=4, padx=2)
        widgets: dict = {"frame": card}

        top = ctk.CTkFrame(card, fg_color="transparent")
        top.pack(fill="x", padx=8, pady=(6, 0))
        ctk.CTkButton(
            top, text="X", width=28, height=24, fg_color="#EF4444", hover_color="#DC2626",
            command=lambda: self._remove_card(widgets),
        ).pack(side="right")

        for key, label, field_spec in self._field_defs:
            kind = self._field_kind(field_spec)
            w = LabelledTextbox(card, label=label, height=60) if kind != "entry" else LabelledEntry(card, label=label)
            w.pack(fill="x", padx=8)
            val = data.get(key, "")
            if kind == "lines" and isinstance(val, list):
                val = "\n".join(val)
            w.set(val)
            widget = w.textbox if kind != "entry" else w.entry
            widget.bind("<KeyRelease>", lambda _e: self._notify())
            widgets[key] = w

        self._cards.append(widgets)
        self._notify()

    def _remove_card(self, widgets: dict) -> None:
        widgets["frame"].destroy()
        self._cards = [c for c in self._cards if c is not widgets]
        self._notify()

    def get_items(self) -> List[dict]:
        items = []
        for card in self._cards:
            item = {}
            for key, _, field_spec in self._field_defs:
                value = card[key].get()
                kind = self._field_kind(field_spec)
                if kind == "lines":
                    item[key] = [line.strip() for line in value.splitlines() if line.strip()]
                elif kind == "textarea":
                    item[key] = value
                else:
                    item[key] = value
            items.append(item)
        return items

    def set_items(self, items: List[dict]) -> None:
        for card in list(self._cards):
            card["frame"].destroy()
        self._cards.clear()
        for item in items:
            self.add_item(item)


class ExperienceEditor(ctk.CTkScrollableFrame):
    """Experience entries with nested Selected Projects."""

    def __init__(self, master, on_change: Optional[Callable] = None, **kwargs) -> None:
        super().__init__(master, **kwargs)
        self._on_change = on_change
        self._cards: List[dict] = []

        header = ctk.CTkFrame(self, fg_color="transparent")
        header.pack(fill="x", pady=(0, 4))
        ctk.CTkLabel(header, text="Work Experience", font=ctk.CTkFont(size=14, weight="bold")).pack(side="left")
        ctk.CTkButton(header, text="+ Add", width=60, command=self.add_item).pack(side="right")

    def _notify(self) -> None:
        if self._on_change:
            self._on_change()

    def add_item(self, data: Optional[dict] = None) -> None:
        data = data or {}
        card = ctk.CTkFrame(self, corner_radius=8)
        card.pack(fill="x", pady=4, padx=2)
        widgets: dict = {"frame": card}

        top = ctk.CTkFrame(card, fg_color="transparent")
        top.pack(fill="x", padx=8, pady=(6, 0))
        ctk.CTkButton(
            top, text="X", width=28, height=24, fg_color="#EF4444",
            command=lambda: self._remove(widgets),
        ).pack(side="right")

        for label, key, field_spec in [
            ("Job Title (include company if needed)", "title", "entry"),
            ("Duration", "duration", "entry"),
            ("Description (Enter = new line)", "description", "textarea"),
            ("Additional Bullets (one per line)", "bullets", "lines"),
        ]:
            kind = DynamicListEditor._field_kind(field_spec)
            if kind == "entry":
                w = LabelledEntry(card, label=label)
                bind_target = w.entry
            else:
                w = LabelledTextbox(card, label=label, height=60)
                bind_target = w.textbox
            w.pack(fill="x", padx=8)
            val = data.get(key, "")
            if isinstance(val, list):
                val = "\n".join(val)
            w.set(val)
            bind_target.bind("<KeyRelease>", lambda _e: self._notify())
            widgets[key] = w

        proj_label = ctk.CTkLabel(card, text="Selected Projects", font=ctk.CTkFont(size=12, weight="bold"))
        proj_label.pack(anchor="w", padx=8, pady=(4, 0))
        proj_editor = DynamicListEditor(
            card, "Project",
            field_defs=[("name", "Project Name", False), ("bullets", "Details (one per line)", True)],
            on_change=self._notify,
        )
        proj_editor.pack(fill="x", padx=4)
        proj_editor.set_items(data.get("selected_projects", []))
        widgets["selected_projects"] = proj_editor

        self._cards.append(widgets)
        self._notify()

    def _remove(self, widgets: dict) -> None:
        widgets["frame"].destroy()
        self._cards = [c for c in self._cards if c is not widgets]
        self._notify()

    def get_items(self) -> List[dict]:
        items = []
        for card in self._cards:
            bullets = card["bullets"].get()
            items.append({
                "title": card["title"].get(),
                "duration": card["duration"].get(),
                "description": card["description"].get(),
                "bullets": [b.strip() for b in bullets.splitlines() if b.strip()],
                "selected_projects": card["selected_projects"].get_items(),
            })
        return items

    def set_items(self, items: List[dict]) -> None:
        for card in list(self._cards):
            card["frame"].destroy()
        self._cards.clear()
        for item in items:
            self.add_item(item)


class SectionOrderPanel(ctk.CTkFrame):
    SECTION_LABELS = {
        "education": "Education",
        "experience": "Experiences",
        "projects": "Projects",
        "skills": "Skills",
    }

    def __init__(self, master, on_change: Optional[Callable] = None, **kwargs) -> None:
        super().__init__(master, **kwargs)
        self._on_change = on_change
        self._order: List[str] = list(self.SECTION_LABELS.keys())
        self._rows: List[ctk.CTkFrame] = []

        ctk.CTkLabel(self, text="Section Order", font=ctk.CTkFont(size=13, weight="bold")).pack(anchor="w", pady=(0, 6))
        self._container = ctk.CTkFrame(self, fg_color="transparent")
        self._container.pack(fill="both", expand=True)
        self._rebuild_rows()

    def _rebuild_rows(self) -> None:
        for row in self._rows:
            row.destroy()
        self._rows.clear()
        for idx, key in enumerate(self._order):
            row = ctk.CTkFrame(self._container, corner_radius=6, height=32)
            row.pack(fill="x", pady=2)
            ctk.CTkLabel(row, text=self.SECTION_LABELS.get(key, key), anchor="w").pack(side="left", padx=8)
            btn_frame = ctk.CTkFrame(row, fg_color="transparent")
            btn_frame.pack(side="right", padx=4)
            ctk.CTkButton(btn_frame, text="^", width=28, height=24, command=lambda i=idx: self._move(i, -1)).pack(side="left", padx=1)
            ctk.CTkButton(btn_frame, text="v", width=28, height=24, command=lambda i=idx: self._move(i, 1)).pack(side="left", padx=1)
            self._rows.append(row)

    def _move(self, index: int, direction: int) -> None:
        new_index = index + direction
        if 0 <= new_index < len(self._order):
            self._order[index], self._order[new_index] = self._order[new_index], self._order[index]
            self._rebuild_rows()
            if self._on_change:
                self._on_change()

    def get_order(self) -> List[str]:
        return list(self._order)

    def set_order(self, order: List[str]) -> None:
        self._order = [k for k in order if k in self.SECTION_LABELS]
        for k in self.SECTION_LABELS:
            if k not in self._order:
                self._order.append(k)
        self._rebuild_rows()
