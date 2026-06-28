"""
data.py - Resume data models and JSON serialization.

Data structure aligned with the single-column public resume layout:
Education → Experiences → Projects → Skills.
"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List


DEFAULT_SECTION_ORDER: List[str] = [
    "education",
    "experience",
    "projects",
    "skills",
]


@dataclass
class ContactLink:
    """Right-aligned header link (LinkedIn, GitHub, custom, etc.)."""

    label: str = ""
    url: str = ""


@dataclass
class ContactInfo:
    """Header contact block."""

    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    links: List[ContactLink] = field(default_factory=list)
    # Legacy fields – migrated to links on load
    github: str = ""
    linkedin: str = ""
    portfolio: str = ""


@dataclass
class SelectedProject:
    """Nested project bullet under an experience entry."""

    name: str = ""
    bullets: List[str] = field(default_factory=list)


@dataclass
class Experience:
    """
    Work experience entry.

    title: Bold headline (e.g. 'Freelance Software Developer' or
           'Software Developer - RDCW Co., Ltd. (Internship)').
    description: Opening paragraph under the title.
    selected_projects: Optional 'Selected Projects' bullet list.
    bullets: Additional plain bullet points (no sub-list).
    """

    title: str = ""
    duration: str = ""
    description: str = ""
    selected_projects: List[SelectedProject] = field(default_factory=list)
    bullets: List[str] = field(default_factory=list)


@dataclass
class Project:
    """Standalone project line: Name - Description - Link."""

    name: str = ""
    description: str = ""
    link: str = ""


@dataclass
class Education:
    """Education row: bold degree+institution with right-aligned dates."""

    degree: str = ""
    institution: str = ""
    duration: str = ""
    gpa: str = ""
    gpax: str = ""


@dataclass
class Language:
    """Spoken language with proficiency."""

    name: str = ""
    level: str = ""


@dataclass
class ResumeData:
    """Root container for all resume content."""

    contact: ContactInfo = field(default_factory=ContactInfo)
    education: List[Education] = field(default_factory=list)
    experience: List[Experience] = field(default_factory=list)
    projects: List[Project] = field(default_factory=list)
    tech_stack: str = ""
    languages: List[Language] = field(default_factory=list)
    section_order: List[str] = field(default_factory=lambda: list(DEFAULT_SECTION_ORDER))
    template: str = "public"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> ResumeData:
        contact_raw = payload.get("contact", {})
        contact = ContactInfo(**{
            k: v for k, v in contact_raw.items()
            if k in ContactInfo.__dataclass_fields__ and k != "links"
        })
        contact.links = [
            ContactLink(**link) for link in contact_raw.get("links", [])
        ]
        if not contact.links:
            for label, key in [("LinkedIn", "linkedin"), ("GitHub", "github"), ("Portfolio", "portfolio")]:
                url = contact_raw.get(key, "") or getattr(contact, key, "")
                if url:
                    contact.links.append(ContactLink(label=label, url=url))

        education = [Education(**e) for e in payload.get("education", [])]

        experience = []
        for raw in payload.get("experience", []):
            selected = [
                SelectedProject(
                    name=sp.get("name", ""),
                    bullets=sp.get("bullets", []),
                )
                for sp in raw.get("selected_projects", [])
            ]
            title = raw.get("title", "")
            if not title:
                pos = raw.get("position", "")
                company = raw.get("company", "")
                title = f"{pos} - {company}" if company else pos
            description = raw.get("description", "")
            if not description and raw.get("responsibilities"):
                resp = raw["responsibilities"]
                description = resp[0] if isinstance(resp, list) and resp else str(resp)
            bullets = raw.get("bullets", [])
            if not bullets and raw.get("responsibilities") and description:
                bullets = raw["responsibilities"][1:] if len(raw.get("responsibilities", [])) > 1 else []
            experience.append(Experience(
                title=title,
                duration=raw.get("duration", ""),
                description=description,
                selected_projects=selected,
                bullets=bullets,
            ))

        projects = []
        for raw in payload.get("projects", []):
            link = raw.get("link", "") or raw.get("github", "") or raw.get("demo", "")
            projects.append(Project(
                name=raw.get("name", ""),
                description=raw.get("description", ""),
                link=link,
            ))

        languages = [Language(**lang) for lang in payload.get("languages", [])]

        return cls(
            contact=contact,
            education=education,
            experience=experience,
            projects=projects,
            tech_stack=payload.get("tech_stack", _legacy_tech_stack(payload)),
            languages=languages,
            section_order=payload.get("section_order", list(DEFAULT_SECTION_ORDER)),
            template=payload.get("template", "public"),
        )

    def save_json(self, path: str | Path) -> None:
        target = Path(path)
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("w", encoding="utf-8") as fh:
            json.dump(self.to_dict(), fh, ensure_ascii=False, indent=2)

    @classmethod
    def load_json(cls, path: str | Path) -> ResumeData:
        with Path(path).open("r", encoding="utf-8") as fh:
            return cls.from_dict(json.load(fh))


def _legacy_tech_stack(payload: Dict[str, Any]) -> str:
    """Convert old categorised skills JSON to a comma-separated string."""
    parts: List[str] = []
    for cat in payload.get("skills", []):
        for skill in cat.get("skills", []):
            name = skill.get("name", "") if isinstance(skill, dict) else str(skill)
            if name:
                parts.append(name)
    return ", ".join(parts)


def sample_resume() -> ResumeData:
    """Sample data matching the public resume structure."""
    return ResumeData(
        contact=ContactInfo(
            full_name="Maythiwat Chomchuen",
            email="hello@example.com",
            phone="+66 XX XXX XXXX",
            location="Chiang Mai, Thailand",
            links=[
                ContactLink("LinkedIn", "https://linkedin.com/in/maythiwat"),
                ContactLink("GitHub", "https://github.com/maythiwat"),
                ContactLink("Portfolio", "https://maythiwat.com"),
            ],
        ),
        education=[
            Education(
                degree="B.Eng. (Computer Engineering)",
                institution="Rajamangala University of Technology Lanna",
                duration="2024 - present",
                gpa="3.50",
                gpax="3.45",
            ),
            Education(
                degree="Diploma in Vocational Ed. (Industrial Electronics)",
                institution="Uttaradit Technical College",
                duration="2022 - 2024",
                gpa="3.80",
                gpax="3.75",
            ),
        ],
        experience=[
            Experience(
                title="Freelance Software Developer",
                duration="2018 - present",
                description="Designed and developed full-stack web applications for various clients",
                selected_projects=[
                    SelectedProject(
                        name="AAR/Registration Office Website - Rajamangala University of Technology Lanna",
                        bullets=[
                            "Designed and developed the academic portal website using SvelteKit and Node.js",
                            "Integrated the website with an in-house CMS and registration system",
                            "Implemented new features such as the student portal and course section search",
                        ],
                    ),
                    SelectedProject(
                        name="Game Top-up & Cash Card E-commerce Website - MT-Topup Co., Ltd.",
                        bullets=[
                            "Designed and developed the MT-Topup website using SvelteKit and Node.js",
                            "Integrated multiple payment gateways and game distributor APIs",
                        ],
                    ),
                ],
            ),
            Experience(
                title="Software Developer - RDCW Co., Ltd. (Internship)",
                duration="May 2023 - October 2023",
                description=(
                    "Designed and developed an early version of the \"Slip Verify by RDCW\" system, "
                    "a bank transfer slip verification service for e-commerce businesses and developers."
                ),
                bullets=[
                    "Integrated bank Open API to verify bank transfer slips from supported banks",
                ],
            ),
            Experience(
                title="Web Developer / IT - Uttaradit Provincial Prison (Internship)",
                duration="May 2021 - October 2021",
                description="Designed and developed an organizational website and a COVID-19 reporting system using PHP",
            ),
        ],
        projects=[
            Project(
                name="promptparse",
                description="All-in-one JS library for PromptPay & EMVCo QR Codes \"Parse, Generate, Manipulate, Validate\"",
                link="github.com/maythiwat/promptparse",
            ),
            Project(
                name="Makerneed",
                description="Online 3D Printing Platform, Instant price estimation",
                link="makerneed.com",
            ),
            Project(
                name="VTuber FavorList",
                description="VTuber Statistics Platform (Thailand & Worldwide)",
                link="vtuber.favorlist.com",
            ),
        ],
        tech_stack=(
            "SvelteKit, React, Next.js, Node.js & Bun (JavaScript/TypeScript), TailwindCSS, "
            "Bootstrap, PHP, MySQL, MongoDB, Docker, Vercel, Cloudflare (WAF, Pages, Workers), Figma"
        ),
        languages=[
            Language("Thai", "Native"),
            Language("English", "Intermediate"),
        ],
    )
