"""
gui/app.py - Main CustomTkinter application for the public resume builder.
"""

from __future__ import annotations

import webbrowser
from pathlib import Path
from tkinter import filedialog, messagebox

import customtkinter as ctk

from data import ContactInfo, ContactLink, Education, Experience, Language, Project, ResumeData, SelectedProject, sample_resume
from gui.components import (
    DynamicListEditor,
    ExperienceEditor,
    LabelledEntry,
    LabelledTextbox,
    SectionOrderPanel,
)
from gui.preview import PreviewPanel
from template import export_pdf, preview_html
from utils import DATA_DIR, OUTPUT_DIR, ensure_directories


class ResumeBuilderApp(ctk.CTk):
    APP_TITLE = "Resume Builder"
    WINDOW_SIZE = "1280x800"

    def __init__(self) -> None:
        super().__init__()
        ensure_directories()
        self._data = sample_resume()
        self._current_file: Path | None = None
        self._gui_mode = "dark"

        self.title(self.APP_TITLE)
        self.geometry(self.WINDOW_SIZE)
        self.minsize(1000, 650)
        ctk.set_appearance_mode("dark")

        self._build_toolbar()
        self._build_layout()
        self._populate_from_data()
        self.on_data_changed()

    def _build_toolbar(self) -> None:
        toolbar = ctk.CTkFrame(self, height=44, corner_radius=0)
        toolbar.pack(fill="x")

        for text, cmd in [
            ("New", self._new_resume),
            ("Open JSON", self._open_json),
            ("Save JSON", self._save_json),
            ("Export PDF", self._export_pdf),
            ("HTML Preview", self._open_html_preview),
        ]:
            ctk.CTkButton(toolbar, text=text, width=100, command=cmd).pack(side="left", padx=4, pady=6)

        self._theme_btn = ctk.CTkButton(toolbar, text="Light Mode", width=90, command=self._toggle_gui_theme)
        self._theme_btn.pack(side="right", padx=8, pady=6)

    def _build_layout(self) -> None:
        paned = ctk.CTkFrame(self, fg_color="transparent")
        paned.pack(fill="both", expand=True, padx=8, pady=8)

        left = ctk.CTkFrame(paned, width=520)
        left.pack(side="left", fill="both", expand=True, padx=(0, 6))
        left.pack_propagate(False)

        self._tabs = ctk.CTkTabview(left)
        self._tabs.pack(fill="both", expand=True)

        self._build_contact_tab()
        self._build_education_tab()
        self._build_experience_tab()
        self._build_projects_tab()
        self._build_skills_tab()
        self._build_order_tab()

        right = ctk.CTkFrame(paned)
        right.pack(side="right", fill="both", expand=True)
        ctk.CTkLabel(right, text="Live Preview", font=ctk.CTkFont(size=15, weight="bold")).pack(anchor="w", padx=8, pady=(4, 0))
        self._preview = PreviewPanel(right)
        self._preview.pack(fill="both", expand=True)

    def _build_contact_tab(self) -> None:
        tab = self._tabs.add("Contact")
        scroll = ctk.CTkScrollableFrame(tab)
        scroll.pack(fill="both", expand=True)

        ctk.CTkLabel(
            scroll, text="Basic Info",
            font=ctk.CTkFont(size=14, weight="bold"),
        ).pack(anchor="w", padx=8, pady=(8, 4))

        self._contact_fields = {
            k: LabelledEntry(scroll, label)
            for k, label in [
                ("full_name", "Full Name"),
                ("location", "Location"),
                ("email", "Email"),
                ("phone", "Phone"),
            ]
        }
        for field in self._contact_fields.values():
            field.pack(fill="x", padx=8)
            field.entry.bind("<KeyRelease>", lambda _e: self.on_data_changed())

        ctk.CTkLabel(
            scroll, text="Links (shown below name on resume)",
            font=ctk.CTkFont(size=14, weight="bold"),
        ).pack(anchor="w", padx=8, pady=(12, 4))

        self._contact_links = DynamicListEditor(
            scroll,
            "Link",
            field_defs=[
                ("label", "Label (e.g. LinkedIn)", False),
                ("url", "URL", False),
            ],
            on_change=self.on_data_changed,
        )
        self._contact_links.pack(fill="x", padx=4, pady=4)

    def _build_education_tab(self) -> None:
        tab = self._tabs.add("Education")
        self._edu_editor = DynamicListEditor(
            tab, "Education",
            field_defs=[
                ("degree", "Degree", False),
                ("institution", "Institution", False),
                ("duration", "Duration", False),
                ("gpa", "GPA", False),
                ("gpax", "GPAX", False),
            ],
            on_change=self.on_data_changed,
        )
        self._edu_editor.pack(fill="both", expand=True, padx=4, pady=4)

    def _build_experience_tab(self) -> None:
        tab = self._tabs.add("Experience")
        self._exp_editor = ExperienceEditor(tab, on_change=self.on_data_changed)
        self._exp_editor.pack(fill="both", expand=True, padx=4, pady=4)

    def _build_projects_tab(self) -> None:
        tab = self._tabs.add("Projects")
        self._proj_editor = DynamicListEditor(
            tab, "Projects",
            field_defs=[
                ("name", "Project Name", False),
                ("description", "Description (Enter = new line)", "textarea"),
                ("link", "Link (github.com/... or domain.com)", False),
            ],
            on_change=self.on_data_changed,
        )
        self._proj_editor.pack(fill="both", expand=True, padx=4, pady=4)

    def _build_skills_tab(self) -> None:
        tab = self._tabs.add("Skills")
        self._tech_stack = LabelledTextbox(tab, "Tech Stack (comma-separated)", height=100)
        self._tech_stack.pack(fill="x", padx=8, pady=8)
        self._tech_stack.textbox.bind("<KeyRelease>", lambda _e: self.on_data_changed())

        self._lang_editor = DynamicListEditor(
            tab, "Languages",
            field_defs=[("name", "Language", False), ("level", "Level", False)],
            on_change=self.on_data_changed,
        )
        self._lang_editor.pack(fill="both", expand=True, padx=4, pady=4)

    def _build_order_tab(self) -> None:
        tab = self._tabs.add("Layout")
        self._order_panel = SectionOrderPanel(tab, on_change=self.on_data_changed)
        self._order_panel.pack(fill="both", expand=True, padx=8, pady=8)

    def on_data_changed(self) -> None:
        self._data = self._collect_data()
        self._preview.schedule_update(self._data)

    def _collect_data(self) -> ResumeData:
        c = self._contact_fields
        contact = ContactInfo(
            full_name=c["full_name"].get(),
            location=c["location"].get(),
            email=c["email"].get(),
            phone=c["phone"].get(),
            links=[
                ContactLink(label=item["label"], url=item["url"])
                for item in self._contact_links.get_items()
                if item.get("label") or item.get("url")
            ],
        )

        experience = []
        for item in self._exp_editor.get_items():
            experience.append(Experience(
                title=item["title"],
                duration=item["duration"],
                description=item["description"],
                bullets=item["bullets"],
                selected_projects=[
                    SelectedProject(name=sp["name"], bullets=sp["bullets"])
                    for sp in item["selected_projects"]
                ],
            ))

        return ResumeData(
            contact=contact,
            education=[Education(**e) for e in self._edu_editor.get_items()],
            experience=experience,
            projects=[Project(**p) for p in self._proj_editor.get_items()],
            tech_stack=self._tech_stack.get(),
            languages=[Language(**lang) for lang in self._lang_editor.get_items()],
            section_order=self._order_panel.get_order(),
        )

    def _populate_from_data(self) -> None:
        d = self._data
        for key, widget in self._contact_fields.items():
            widget.set(getattr(d.contact, key, ""))

        links = d.contact.links
        if not links:
            links = [
                ContactLink("LinkedIn", d.contact.linkedin),
                ContactLink("GitHub", d.contact.github),
                ContactLink("Portfolio", d.contact.portfolio),
            ]
        self._contact_links.set_items([
            {"label": link.label, "url": link.url}
            for link in links if link.label or link.url
        ])

        self._edu_editor.set_items([{
            "degree": e.degree, "institution": e.institution, "duration": e.duration,
            "gpa": e.gpa, "gpax": e.gpax,
        } for e in d.education])

        self._exp_editor.set_items([{
            "title": e.title,
            "duration": e.duration,
            "description": e.description,
            "bullets": e.bullets,
            "selected_projects": [{"name": sp.name, "bullets": sp.bullets} for sp in e.selected_projects],
        } for e in d.experience])

        self._proj_editor.set_items([{
            "name": p.name, "description": p.description, "link": p.link,
        } for p in d.projects])

        self._tech_stack.set(d.tech_stack)
        self._lang_editor.set_items([{"name": l.name, "level": l.level} for l in d.languages])
        self._order_panel.set_order(d.section_order)

    def _new_resume(self) -> None:
        if messagebox.askyesno("New Resume", "Start blank? Unsaved changes will be lost."):
            self._data = ResumeData()
            self._current_file = None
            self._populate_from_data()
            self.on_data_changed()

    def _open_json(self) -> None:
        path = filedialog.askopenfilename(initialdir=DATA_DIR, filetypes=[("JSON", "*.json")])
        if not path:
            return
        try:
            self._data = ResumeData.load_json(path)
            self._current_file = Path(path)
            self._populate_from_data()
            self.on_data_changed()
        except Exception as exc:
            messagebox.showerror("Error", str(exc))

    def _save_json(self) -> None:
        self._data = self._collect_data()
        path = self._current_file
        if path is None:
            path_str = filedialog.asksaveasfilename(
                initialdir=DATA_DIR, defaultextension=".json",
                filetypes=[("JSON", "*.json")], initialfile="my_resume.json",
            )
            if not path_str:
                return
            path = Path(path_str)
        self._data.save_json(path)
        self._current_file = path
        messagebox.showinfo("Saved", f"Saved to:\n{path}")

    def _export_pdf(self) -> None:
        self._data = self._collect_data()
        name = self._data.contact.full_name.replace(" ", "_") or "resume"
        path = filedialog.asksaveasfilename(
            initialdir=OUTPUT_DIR, defaultextension=".pdf",
            filetypes=[("PDF", "*.pdf")], initialfile=f"{name}_CV.pdf",
        )
        if path:
            export_pdf(self._data, path)
            messagebox.showinfo("Exported", f"PDF saved:\n{path}")

    def _open_html_preview(self) -> None:
        self._data = self._collect_data()
        html_path = OUTPUT_DIR / "preview.html"
        html_path.write_text(preview_html(self._data), encoding="utf-8")
        webbrowser.open(html_path.as_uri())

    def _toggle_gui_theme(self) -> None:
        self._gui_mode = "light" if self._gui_mode == "dark" else "dark"
        ctk.set_appearance_mode(self._gui_mode)
        self._theme_btn.configure(text="Dark Mode" if self._gui_mode == "light" else "Light Mode")


def run_app() -> None:
    ResumeBuilderApp().mainloop()
