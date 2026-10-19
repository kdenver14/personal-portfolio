---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Surface: portfolio home (single page)

Scope: the whole site, one route. Visitor mode: Experience (the work leads from the first viewport).
Audience/job: internship and junior-role screeners deciding in under two minutes whether Kurt can build; they verify on GitHub. Action: open a repo, or email.
Constraints: static export, light only, every fact traceable to a public repo, user steer "not too bold, professionalism with taste".

## Direction contract

Revision 2026-10-20 (second): the minimal datasheet was rejected as "so badly designed": plain like a document, type and spacing off, projects as walls of text. The owner chose a single narrow column (emilkowal.ski, paco.me), light, and kept the chip figure. The datasheet survives only as the chip.

THESIS: A calm single column, about 640px, that reads like a well-made personal page: who they are, the four repos they pinned (each with one visual), every other repo, how to reach them.

OWN-WORLD: White page, ink #171717, gray secondary text #5F6368, tertiary #737373 on white only, hairlines #EBEBE9, soft panels #F5F5F4 with 14px radius for every visual. Links are ink with a light underline. Blue #0A5BD3 only for focus, the active pin and the gesture bones; orange #B4450A only for "In development". Instrument Serif for the name (40px), card titles and dialog titles; Instrument Sans for all other text (body 16px); JetBrains Mono for pin names, file names and code. No header bar, no numbered sections, no tables, no boxed tags or pills.

STORY: Name, role and place, two short bio paragraphs, availability, Email and GitHub, a right-to-left strip of monochrome technology logos (pauses on hover, no Pause button by owner choice, still under reduced motion), then the chip in a panel. Projects: a 2-up grid of soft-panel cards (serif title, year, status when in development, one line, tags, "View project"). A card opens a dialog, keyed to the URL hash, holding everything: video when present, overview, gesture data or code listing, how-it-works steps, details and the source link. More projects: hairline list of name, one line and year. Contact: one line, email, GitHub. Footer: copyright and last update.

FIRST VIEWPORT: The intro text and the top of the chip panel.

FORM: seed:1695d05323ff3319, reduced to the chip.
Signature interaction: hover, focus or tap a pin to light its leg blue and show its description; GH and MAIL pins are links; CLK shows live PHT time. Motion grammar: 160ms color change, no entrance animation, reduced-motion safe.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
