---
name: Denver
description: The one-page portfolio of Kurt Denver Chavez, a calm light column with a serif name, project rows that open into dialogs, and a facts card for someone hiring: where they study, what they're open to, and their local time.
colors:
  paper: "#f5f7fa"
  ink: "#171717"
  ink-2: "#5f6368"
  ink-3: "#6b6b6b"
  line: "#e0e5eb"
  line-strong: "#c3cbd5"
  panel: "#eaeef3"
  panel-hover: "#e1e6ed"
  blue: "#0a5bd3"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "'kern', 'liga'"
  summary:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  body-list:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  small:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  micro:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  focus: "2px"
  node: "8px"
  panel: "14px"
  dialog: "18px"
  pill: "999px"
spacing:
  gutter: "1.25rem"
  measure: "40rem"
  dialog-width: "44rem"
  page-top-mobile: "4.5rem"
  page-top: "7.5rem"
  section-mobile: "5rem"
  section: "6.5rem"
  section-title-gap: "1.75rem"
  strip-top: "2.5rem"
  facts-top: "2.5rem"
  project-row: "1.125rem 0.75rem"
  dialog-block-gap: "1.75rem"
  list-row: "0.75rem"
  fact-row: "0.625rem"
  footer-top: "6rem"
components:
  link:
    textColor: "{colors.ink}"
  link-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  section-title:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
  panel-caption:
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
  caption:
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
  project-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.node}"
    padding: "1.125rem 0.75rem"
  project-row-hover:
    backgroundColor: "{colors.panel}"
  project-row-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  project-row-summary:
    textColor: "{colors.ink-2}"
    typography: "{typography.summary}"
  project-row-tags:
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
  project-meta:
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
  status-preview:
    textColor: "{colors.blue}"
    typography: "{typography.small}"
  tags:
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    width: "44rem"
  dialog-close:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.75rem"
  dialog-title:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  detail-label:
    textColor: "{colors.ink-3}"
    typography: "{typography.label}"
  fact:
    textColor: "{colors.ink}"
    typography: "{typography.body-list}"
    padding: "0.625rem 0"
  tech-strip:
    textColor: "{colors.ink-3}"
    size: "1.75rem"
  live-diagram:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
    padding: "1.125rem 1.25rem"
  code-listing:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.panel}"
    padding: "0.75rem 1.125rem 1.125rem"
  list-row:
    textColor: "{colors.ink}"
    typography: "{typography.body-list}"
    padding: "0.75rem 0"
  facts:
    textColor: "{colors.ink}"
    typography: "{typography.body-list}"
    padding: "1.25rem 0 0"
  footer:
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
    padding: "1.75rem 0 3rem"
---

# Design System: Denver

## Overview

**Creative North Star: "The Quiet Column"**

One narrow column on a cool near-white with a faint blue cast, about 640px, read top to bottom like a well-made personal page. It runs name, role line and short bio, a facts card (studying, open to, local time), four project rows, experience, a Technologies section that opens with a sliding strip of logos and then lists every technology, the longest contribution streak, six more repos with a link to the rest on GitHub, and how to reach them. Instrument Serif at 400 carries the voice moments: the 40px name, project names and dialog titles. Instrument Sans carries everything else at small, even sizes. JetBrains Mono appears only where the content is literally code or a file name.

The owner's standing steer governs every surface: "not too bold, professionalism with taste". The page stays a summary. Each featured project is a hairline row with a serif name, its year and an arrow, one short line and tags. The row opens a native dialog keyed to the URL hash, and the full story lives there. That story is the overview, a live diagram of the project working, gesture data or a code listing, a Details list and the source link. Whitespace groups the page. Hairlines appear only in lists: Projects, More projects, Contact, the dialog's Details, the dialog foot and the footer.

The owner retired the DIP-8 chip on 2026-10-23 after three redesigns. Its place under the tech strip went briefly to a "How I write code" block (rejected: no visual) and then a dot globe (rejected: "just a globe", no facts). What the owner liked in the chip was a visual whose parts are facts about them. An ID badge on a swinging strap followed and was rejected too: the owner had to wait for it to stop moving to read it. Then three parody formats (a food label, a receipt, an index card with a stamp) were rejected as corny. "At a glance", a summary panel with a code-share bar, came next and was dropped the same day for repeating the page: the availability line, the projects, the pull request, the streak and the links all appear elsewhere. A language line (home and four languages as transit stops) followed, then lost its notes to the Technologies section. On 2026-10-24 the owner asked what a large company's recruiter wants, and the slot became a facts card: where they study, what they're open to, and their local time. The intro's Email/GitHub/LinkedIn row went too, since Contact carries them. Rules for this slot: only facts found nowhere else on the page, readable at load, in plain copy that would work on a résumé. Light only, by design (`color-scheme: light`).

**Key Characteristics:**
- Cool near-white page with a faint blue cast, near-black ink, two quieter greys, blue-gray hairlines.
- Visuals sit in soft Panel fills with a 14px radius. The dialog is the one Paper surface lifted off the page.
- Serif for names and titles, sans for everything else, mono only for literal code and markings.
- Links are ink with a light blue-gray underline that darkens on hover. Blue is not a link colour.
- Blue, the only accent, marks focus, the active pin, the gesture skeletons and one status word.
- One shadow in the system, on the open dialog.
- Motion is a 160ms colour change, plus a 200ms dialog rise, the tech strip's slow loop and the streak's slow blink. All three stop under reduced motion.

## Colors

A grey-ink palette on a cool near-white with a faint blue cast, the owner's "not too white" ground. Panels and hairlines are blue-gray, and the tint complements Signal Blue. One saturated blue, the only accent, marks focus, the data being pointed at and a single status.

### Primary
- **Signal Blue** (`blue`): the focus ring, Contact's "Copied" confirmation, the particles switch while on, the bones and joint strokes of the gesture skeletons, and the "In development" status word in a project row and in a dialog head. It means "this is focused", "this is the data you are pointing at" or "this is still being built".

### Neutral
- **Paper** (`paper`): the page, the dialog surface, the Close pill, the live diagram's empty stops and method chip, and the theme colour.
- **Ink** (`ink`): the name, project names and dialog titles, links, the facts card's values, code, and text selection (ink background, paper text). At 40% it is the dialog backdrop.
- **Graphite** (`ink-2`): the role line, bio, project lines, project and dialog meta and tags, the tech strip, dialog overview text, the contact line, captions inside panels, the facts card's details, code-listing line numbers and comments, and gesture labels.
- **Slate** (`ink-3`): section titles, the facts card's labels, the dialog sub-heading ("Details"), fact labels, the strip's logos, More projects years, the project rows' arrows, the footer, and captions on Paper.
- **Hairline** (`line`): the rule above the intro facts, row rules in Projects, More projects, Contact and Details, the rule above the dialog foot, the footer's top rule and the Close pill's resting border.
- **Hairline Strong** (`line-strong`): resting link underlines, the live diagram's line and resting stops, the tech strip's dot separators and the Close pill's hover border.
- **Panel** (`panel`): the live diagram and code panels, the placeholder fill of a demo video, and the tint of a hovered list row (Projects, More projects, Contact).
- **Panel Hover** (`panel-hover`): the navbar link for the section in view, and nothing else.

### Named Rules
**The Slate On Paper Rule.** Slate (`ink-3`) sits on Paper only. It clears AA on Paper (4.97:1) but only just clears it on Panel (4.57:1). Text inside a panel uses Graphite (5.19:1 on Panel) or Ink, and a list row's Slate icon, arrow or year turns Ink or gives way when the row tints on hover.

**The One Signal Rule.** Signal Blue is the only accent. It marks focus, the active pin, the gesture bones and the "In development" status word (5.67:1 on Paper, 5.22:1 on Panel). It is never decoration, a heading colour, a link colour or a fill.

## Typography

**Display Font:** Instrument Serif 400 (with Georgia, serif).
**Body Font:** Instrument Sans (with Helvetica Neue, Arial, sans-serif).
**Label/Mono Font:** JetBrains Mono 400 (with ui-monospace, Menlo, monospace).

**Character:** A narrow, bookish serif sets every name on the page. A clean grotesque at small, even sizes carries everything else. The serif provides warmth and scale. The sans stays quiet and does the reading work.

### Hierarchy
- **Display** (Serif 400, 2.5rem, line-height 1.05, tracking -0.01em): the name, once per page.
- **Headline** (Serif 400, 2.25rem, line-height 1.05): the project name at the top of its dialog.
- **Title** (Serif 400, 1.375rem, line-height 1.15): project names in the Projects rows.
- **Body** (Sans 400, 1rem, line-height 1.65): bio, dialog overview, contact line. Contact's email row ends in a Copy pill (Hairline Strong border on Paper, Sans 500 0.8125rem). After a copy it reads "Copied" in Signal Blue for 1.6s. The 40rem column holds lines near 75ch.
- **Summary** (Sans 400, 0.9375rem, line-height 1.55): the one short line in a project row.
- **Body List** (Sans 400, 0.9375rem, line-height 1.5): More projects rows (names at 500), Details facts (line-height 1.45) and the tech strip.
- **Label** (Sans 500, 0.875rem, line-height 1.4, Slate, sentence case): section titles and dialog sub-headings. These are real headings, not kickers over another heading. The Close pill uses the same size and weight in Ink.
- **Small** (Sans 400, 0.875rem): project meta, status, and tags in the dialog foot.
- **Caption** (Sans 400, 0.8125rem, line-height 1.5): panel captions (centred, Graphite), tags in project rows, the video caption (Slate), fact labels, live-diagram stops and the footer.
- **Micro** (Sans 400, 0.75rem): pin sublabels, gesture labels, code inside panel captions.
- **Mono** (400, 0.8125rem, line-height 1.7): code listings, file names and code values in Details.

### Named Rules
**The Serif Names Rule.** Instrument Serif sets names only: the person, a project name and a dialog title. It is always weight 400, and only the serif goes above 1rem. Sans text stays between 0.75rem and 1rem, and its emphasis comes from weight (500 for links, labels and list names) and from moving between Ink, Graphite and Slate.

**The Literal Mono Rule.** JetBrains Mono is for text that is literally code, a file name or a gesture name. It is always weight 400 and never used for prose, labels or headings.

## Layout

One centred column, max width 40rem plus a 1.25rem gutter each side, at every viewport. There is no header bar and no navigation. The page starts 4.5rem from the top, or 7.5rem at 48rem and up, with the name first and nothing above it.

Vertical rhythm comes from space. Sections sit 5rem apart, or 6.5rem at 48rem and up. A section title sits 1.75rem above its content. The intro fills the first screen on its own (at least the viewport height less the 6.5rem page top), with its content set a little above centre, so every section the navbar links to starts below the fold. In the intro, the facts sit 2.5rem below the bio. The tech strip leads the Technologies section, 1.75rem above its groups. The footer sits 6rem below the last section.

Projects are a list of rows inside the column, like More projects and Contact, one column at every width.

The project dialog is up to 44rem wide (always 1rem clear of each viewport edge) and at most 90dvh tall (capped at 64rem). It scrolls inside itself. Its body has 1.5rem side padding, or 2.5rem from 40rem, and 1.75rem between blocks. Below 40rem the dialog becomes a bottom sheet: full width, up to 92dvh, attached to the bottom edge. The page behind an open dialog does not scroll.

Rows that pair a name with a year (project rows, dialog head, More projects rows) put the name left and the year right, aligned on the baseline. The breakpoints are 40rem (dialog sheet, live-diagram stops from down to across, gesture panels from three to five across, More projects rows from two lines to 11rem name, description and year) and 48rem (page-top and section spacing).

### Named Rules
**The Space Groups Rule.** Group with whitespace and the panel fill. Hairlines are for lists only: the intro facts, the Projects, More projects and Contact rows, the Details facts, the rule above the dialog foot and the footer. Never put dividers between sections.

**The Summary And Story Rule.** The page carries a summary of each project. The full story (media, overview, live diagram, figures, facts and source) lives in that project's dialog, reachable by URL hash.

## Elevation & Depth

Nearly flat. The page has one tonal step: blue-gray Panel on cool Paper, with Paper stops inside the live diagram's panel. A hovered list row tints to Panel. The only lifted surface is the open dialog. It is Paper over a 40% ink backdrop and carries a single soft, diffuse shadow (exact value in the sidecar). The dialog's sticky bar fades from paper to transparent so content scrolls under the Close pill. Focus is a 2px blue outline with a 3px offset, not a glow.

### Named Rules
**The One Lift Rule.** The modal dialog is the only element with a shadow and a backdrop. Rows, panels and buttons stay flat. Hover changes tone, never elevation.

## Shapes

Soft and consistent. Panels and the demo video share a 14px radius, and a hovered list row tints inside 8px. The dialog is slightly rounder at 18px, and only its top corners round when it becomes a bottom sheet. The live diagram uses 12px. The Close button and the replay control are full pills (999px). The focus ring rounds to 2px. Text, links, tags, lists and the footer have no frames.

## Components

### Links
Quiet, underlined, ink.
- **Default:** Ink text with a 1px Hairline Strong underline, offset 0.25em. The underline turns to the text colour on hover over 160ms.
- **Link row** (contact links, "Source on GitHub"): weight 500. Contact is four rows like More projects (Email, GitHub, LinkedIn, Résumé): a 1.125rem Slate icon (GitHub from Simple Icons, LinkedIn from Devicon, a drawn envelope and page for email and the résumé), the name at 500, the handle in Graphite, then a Slate ↗, or the Copy pill on the email row. The name is the link and stretches over the row, with Copy above it and tints Panel on hover, when the icon and arrow turn Ink and the arrow nudges up and right. Below 40rem the handle drops under the name.
- **List name** (More projects only): weight 500 with no underline at rest. The underline appears on hover.
- **Focus:** a 2px Signal Blue outline, 3px offset, 2px radius, everywhere except list rows, where it is drawn inside the row.

### Buttons
There is one, and it is not a filled call to action.
- **Close pill** (dialog bar): Paper fill, 1px Hairline border, 999px radius, padding 0.375rem 0.75rem, Ink Label type. On hover the border steps to Hairline Strong.

### Section Title
A small Slate Label `h2` in sentence case, 1.75rem above the section's content. It has no number, no rule and no label stacked over it.

### Panel
- **Corner Style:** 14px.
- **Background:** Panel blue-gray. No border and no shadow.
- **Internal Padding:** set per figure, about 2rem top and 1rem to 1.25rem sides and bottom. The code listing is tighter (0.875rem to 1.125rem).
- **Caption:** inside the panel, centred, Graphite Caption, 1.25rem below the figure.

### Project Row
The name is the link to the project's dialog (`#project-id`) and stretches over its row, as in More projects and Contact. The order is: the serif Title, then the year (Graphite, tabular figures) and a Slate → on the right; a Signal Blue "In development" when it applies; a Graphite Summary of one short line; and Graphite tags at Caption size. A hairline sits above the list and under each row. Rows have 1.125rem vertical padding and 0.375rem between lines, and bleed 0.75rem past the column. On hover (pointer devices only) the row tints Panel inside an 8px radius over 160ms, and the arrow turns Ink and nudges right. Keyboard focus draws the blue ring inside the row. A long name wraps rather than pushing the year and arrow off the row.

### Project Dialog
A native modal `<dialog>` opened from the URL hash. A direct link opens it, and Back closes it. Escape, a backdrop click and the Close pill also close it. It is a Paper surface with an 18px radius, the system's one shadow and a 40% ink backdrop. It rises 12px and fades in over 200ms on the house ease-out, with no animation under reduced motion. A sticky bar at the top holds the Close pill on the right. The body runs in this order:
- the head: Headline serif name with status and year;
- the video when present;
- the Graphite overview;
- the Live Diagram, with its caption and Pause/Play/Replay control;
- the gesture panels or the code listing;
- Details (Facts);
- the foot: tags on the left and "Source on GitHub" on the right, under a hairline.

### Facts (Details)
A hairline definition list. There is a top rule on the list, then each fact has a 1px Hairline bottom rule and 0.625rem vertical padding. The Slate Caption label sits over the Ink value. Code values are Mono at 0.8125rem and break anywhere. The tight padding is deliberate list density.

### Tags
Plain text in Graphite: 0.8125rem in project rows, 0.875rem in the dialog foot. Middle dots trail each tag, so a wrapped line never starts with a dot. There are no boxes, pills or fills.

### Tech Strip
A single line of 18 monochrome logos for the main technologies, sliding right to left in a linear loop of 2.5s per logo (45s), so adding logos lengthens the loop without speeding it up. It is a short accent; the Technologies section carries the full list. Every logo path lives in `src/content/logos.ts`, shared with the Contact links.
- **Logos:** 1.75rem square, Slate fill turning Ink on hover, 2.5rem apart. Each is one SVG path: Simple Icons (CC0), or Devicon (MIT) for C#.
- **Names:** each logo carries its name as an accessible label and a native tooltip.
- **Loop:** the list is drawn twice so the loop has no seam, and the copy is hidden from assistive tech. Both edges fade out through a 12% mask.
- **Pausing:** none. By the owner's choice it never pauses, not even on hover, and has no Pause button.
- **Reduced motion:** the strip stops, loses the mask and wraps as a static grid of logos.

### Demo Video (slot)
None is populated yet. When present, it leads the dialog at full width, with the 14px radius and a Panel fill before load. It has native controls and never autoplays. A visible Slate caption sits 0.625rem below it as the text alternative.

### Live Diagram
Each featured pop-up shows its project working, animated from the repo's code. The owner picked this quiet diagram over a terminal or a code walk-through (2026-10-22). It is a Panel block (12px radius, 1.125rem by 1.25rem padding) under the overview. Timelines are pure functions of time in `src/lib/demo.ts` and `src/lib/sort.ts`, and the data lives on each project in `featured.ts`.
- **Stops:** the project's layers as 11px Paper dots on a 1px Hairline Strong line, in Caption type. They run down on phones and across from 40rem. A reached stop gets a Signal Blue ring and Ink text. A planned stage, not built yet, has a dashed ring and a Slate "planned" reading, and the pulse goes hollow while it crosses one.
- **Pulse:** an 11px Signal Blue dot with a soft 4px halo. It eases between stops, takes longer to skip one, and comes back the way it went to the stop that answers.
- **Pipeline** (uptime-monitor): the finished design from the owner's plan, API, PostgreSQL, Scheduler, Queue, Worker, Checker and Alerts, with the planned stages dashed. First the create request runs API to PostgreSQL and back. Then two sample checks of the same monitor run from PostgreSQL to the Checker: one up, with the checker's result fields, and one that times out and goes on to Alerts. The head shows the method (or CHECK) in a Paper chip with the path or URL, then the sample body or interval in Slate Mono. Once answered, a pill (a blue tint for 201 or Up, a Hairline Strong ring for Down) sits beside the response body or the result fields. Room for two detail lines is reserved, so the line never jumps.
- **Sort** (DSA): the repo's bubble and selection sorts on the array in each file's main. Bars are Hairline Strong, compared bars Signal Blue, selection's running minimum 55% blue and settled bars 28% blue. A 2px Panel outline keeps passing bars apart. The run ends on what the program prints.
- **Operators** (Int wrapper): main.cpp line by line. `Int a` and `Int b` sit in Paper cells at the top, and `a` gets a Signal Blue ring when a compound assignment changes it. Under them is the expression in Mono with the value it prints in a blue-tint chip, and the operator's declaration from Int.h in Slate Mono. Then the three heap pointers run down as stops, and the pulse frees one per recursive `ptr_deleter` call, ending on the one-pointer overload.
- **Gesture** (Hand Gesture Control): the mean pose of each recorded gesture eases into the next, in the gesture panels' blue bones. Beside it, the stops run down with a Mono reading each: the frame, 21 landmarks, the gesture, the mode (shown as `DRAW → VOLUME` when it switches) and the action. Readings from the previous beat stay in Slate until the pulse reaches them.
- **Playback:** the same clock and control as the replays. It plays once from the top when the pop-up opens, shows the last frame when closed or under reduced motion, and runs requestAnimationFrame only while playing. The screen is hidden from assistive tech and the caption describes it.

### Code Listing
A panel with a head row above a Mono body at line-height 1.7. The head holds the file name in Mono Graphite and a "View file" link. Long lines wrap with a hanging indent under the code, so phones never scroll or clip a listing. Line numbers are generated, right-aligned in Graphite, and unselectable. Comments are Graphite.

### Navbar
A floating pill, fixed 0.875rem below the top edge so it never touches it, as wide as the column plus 2rem. It is translucent Paper (78%) with a 14px blur, a Hairline border and a soft shadow.
- The brand "Denver" in Instrument Serif links to `#top`, which scrolls to the very top of the page, so it lands on the intro alone as on a first visit, not on the name heading. Section links in page order (Projects, Experience, Technologies, Activity, Contact) are 0.875rem 500 Graphite pills that tint Panel on hover. From 40rem a filled Ink "Résumé" pill with Paper text ends the row, opening the PDF in a new tab; it is the one filled pill, so it reads apart from the section links. Below 40rem it is hidden (the same button leads the intro there, under the bio) and the brand gives way so all five links fit, centred: Technologies reads "Tech", and the links shrink to 0.8125rem, then 0.75rem below 24rem.
- The section in view is marked: its heading has risen above 30% of the viewport. It gets `aria-current` and a Panel-hover fill. A section without a link, such as More projects, marks none.
- Headings jumped to land 5.5rem down, clear of the bar. The page's top padding is 6.5rem.
- On phones the links tighten. Below 23rem the brand hides and the links centre.

### Activity (longest streak)
Only the longest coding streak, drawn like GitHub's contribution calendar but just for the streak's own weeks. The owner asked for the streak, not the whole year. It is `src/components/contribution-graph.tsx`.
- **Data:** `scripts/fetch-contributions.mjs` reads the public GitHub contribution calendar into `src/data/contributions.json`, every day since 2022. It runs as `prebuild` on Vercel, so each deploy refreshes it; if GitHub can't be read, the build logs a warning and ships the committed snapshot. Locally, `npm run contributions` refreshes it. The file is validated before use.
- **Numbers (left):** "Longest streak **71 days** in a row", with the count in Instrument Serif at 2.25rem. The dates and the streak's total contributions sit below in Slate. The streak is all-time, and the latest one wins a tie.
- **Chart (right):** the streak's days in week columns from Sunday, with month labels and Mon/Wed/Fri. Cells are a fixed 14px with 3px gaps and a 3px radius. Days outside the streak in its first and last weeks are blank. Each cell has a `title` with its count and date.
- **Colour:** GitHub's light-theme greens (#9be9a8, #40c463, #30a14e, #216e39). This is the one place the page leaves blue, because the owner asked for GitHub's look.
- **Blink:** the streak's green days light up together in a slow 3s blink, a little brighter with a soft green glow at the peak, as the owner asked on 2026-10-25. The legend stays still, and the chart is still under reduced motion.
- "From GitHub" and a Less–More legend run along the bottom. On phones the chart wraps under the numbers.
- The chart is `aria-hidden`; the figure's label states the streak, its dates and its total.

### Experience Timeline
Roles, newest first, on a vertical timeline. Each role has 1.25rem vertical padding and no rules between rows.
- **Layout:** from 40rem up, a 9rem Slate date column (short month range, tabular figures, right-aligned) sits left of the rail and the body sits right of it, 3rem apart. Below 40rem the rail runs down the left edge and the dates stack above the body.
- **Body:**
  - the title (600);
  - company and terms in Slate small type;
  - a one-line summary in Graphite;
  - skills using the Tags style, with an optional text link on the right.
- **Rail:** 2px, Signal Blue mixed into Paper at 18%. It runs from the first role's dot to the last one's.
- **Dots:** a 10px Paper dot per role with a 2px ring (Signal Blue at 55%), level with the first line of text.
- **Glow:**
  - A soft Signal Blue streak, 3.5rem long, rises up the rail one role per 1.5s slice, starting from the oldest role at the bottom.
  - Each dot's ring turns full blue and gives off a small halo as the streak reaches it, then fades.
  - The cycle is one slice per role plus one slice of rest. With three roles that is 6s.
  - Under reduced motion the timeline is still.

### More Projects List
Six repos the owner chose, each with a replay, newest first. Everything else is one link away: "View more projects ↗" under the list opens the GitHub repositories tab in a new tab. It is Sans 500 at 0.875rem, and the arrow nudges up and right on hover. The owner cut the list from 13 rows (2026-10-22) because a replay for every repo was not worth it.

A hairline list. There is a top rule on the first row, then each row has a 1px Hairline bottom rule and 0.75rem vertical padding. The tight row padding is deliberate list density, confirmed by the owner. Each row shows the name (500), a one-line description in Graphite and the year in Slate tabular figures.
- **Interaction:** quieter than the featured rows, by the owner's choice.
  - The whole row opens the project's pop-up (below): the name's link, to `#<id>`, is stretched over it. Every row has a replay; the build fails if one is missing.
  - Rows bleed 0.75rem past the column so the hover tint has room. The hairlines stay column-wide.
  - On hover, the row takes a Panel tint with a 0.5rem radius, and the year fades up and out as a → arrow slides in, over 160ms.
  - Keyboard focus outlines the whole row in Signal Blue and shows the arrow.
  - Hover styles apply only on devices that can hover, so a tap on a phone doesn't leave a row tinted.

### More Project Pop-up
A compact version of the project dialog (36rem wide, title at 1.875rem), opened through the URL hash like the featured ones. It holds the name and year, the one-line summary, a replay of the project running, and a foot with the language and "Source on GitHub".
- **Replay:** a short scripted animation built from the repository's code, in `src/content/replays.ts`, with the timelines in `src/lib/replay.ts`.
  - **Terminal**, for scripts, APIs and console programs. It is dark (#1d2024), in JetBrains Mono 0.75rem. Commands are typed at a `$` prompt.
    - Output lines are only what the program really prints, in its own wording, with sample values. Success lines are a light blue.
    - Anything off-screen, such as a browser, an email or a key press, is a muted italic `#` comment and never looks like output.
    - The prompt comes back only when the replay ends.
  - **Window**, for UI apps. It is a light mock of the app's screen, using the app's own headings, placeholders and button labels. Fields type in with a blue focus border and a caret, and new list items rise in.
  - **Pong** is the turtle game drawn in SVG with its real court, speeds and scoring, sped up three times.
- **Playback:**
  - It plays once from the top each time the pop-up opens and stops on the last frame.
  - One button is Pause, Play or Replay depending on the state.
  - Under reduced motion it opens on the last frame. Nothing animates while the pop-up is closed.
- **Text alternative:** the screen is `aria-hidden`. The caption under it describes what the replay shows, followed by "A replay of the repo's code, with sample values."
- No secrets or personal values from the repositories appear in any replay.

### Footer
Copyright on the left and the "Updated" month on the right, in Slate Caption type, under a single Hairline. Padding is 1.75rem above and 3rem below.

### Dot Field (decoration)
A liquid field of grey dashes around the text column, in the spirit of Google Antigravity's hero. It is `src/components/dot-field.tsx`, with the pure logic in `src/lib/dot-field.ts` and `src/lib/noise.ts`.
- **Particles:**
  - Poisson-disc spacing (26px minimum) from a fixed seed, on a fixed canvas, so the field stays put while the page scrolls under it.
  - They cover the whole screen, the text column included. Under the column and within 16px of it they fade to a faint 14% visibility (an eighth of full opacity), so the text reads clearly over them, and they brighten to full over the next 110px. Phones get the dimmed field too.
- **Ring:**
  - A ring, 30% of the larger screen side in radius, trails the mouse with a 0.45s ease. That lag is what makes it feel liquid. It also circles a little (6% of its radius, 0.8 rad/s) around a resting mouse, so the field never stops. With no mouse it wanders widely around a point a little below the centre (±22% across, ±16% down).
  - Its radius breathes by 9%, and noise bends its edge in and out.
- **Particle size:**
  - On the ring's band, particles swell into dashes up to about 10px long that point away from the centre. They are pushed out up to 10px.
  - Inside the ring they are medium dashes. Outside it they are specks.
  - Sizes ease over 0.22s, so particles grow and shrink as the band sweeps across them.
- **Drift:** 3D gradient noise moves every particle all the time, even when the mouse is still: a 15px flow plus a finer 2.5px ripple, both about twice the earlier speed so the field reads as alive even when nothing touches it, and a slight wobble in each dash's angle.
- **Colour:** Ink, with opacity rising with size from about 0.28 for specks to 0.7 for the fullest dashes.
- **Drawing:** marks are grouped by size and fade level into about 20 strokes a frame. The simulation takes under 1ms a frame at 1440×900.
- **Behaviour:**
  - Only a mouse steers the ring.
  - Under reduced motion, and when no particle is visible, it draws one still frame and does not animate.
  - It is decorative, so it is `aria-hidden` and has no pointer events.
  - The particles switch turns it off: it stops animating (no frames at all) and hides, and the choice is remembered on the device.

### Particles Switch
A pill pinned 1rem from the bottom-right corner, in the navbar's translucent Paper with a Hairline border, blur and soft shadow. It holds "Particles" in Graphite Sans 500 at 0.75rem and a 1.75rem switch: a Signal Blue track with the Paper knob at the right while on, a Hairline Strong track with the knob at the left while off. It is a `role="switch"` button with `aria-checked`. The visitor's choice is saved in `localStorage` (`particles=off`); if storage is blocked, it still works for that visit. On by default. Below 40rem the Technologies note sticks just above it.

### Stack
The section after Experience, titled "Technologies" (`#technologies`), with a matching nav link. It sits after the proof (Projects, then Experience) as a reference list; the owner moved it there from first place on 2026-10-25. It lists 36 technologies from the public repos (`src/content/stack.ts`) in six groups: Languages, Frontend, Backend, Data, ML and automation, Tools. The owner picked it from a live specimen (grouped list, logo grid, tabs) on 2026-10-24.
- **Rows:** one per group between Hairline rules, 0.75rem padding top and bottom. The group name is Slate Sans 500 at 0.8125rem in an 8.5rem column (stacked above the pills below 40rem), followed by wrapping pills.
- **Pills:** small and quiet: Panel fill, full radius, padding 0.2rem 0.6rem, 0.3rem apart, and only the name, in Ink Sans 400 at 0.8125rem. They carry no logos, since the strip above has them. The owner cut the logos and the weight from a live specimen on 2026-10-25, when the section felt cluttered.
- **Notes:** pointing at, focusing or tapping a pill turns it Ink with Paper text. The Graphite caption under the rows then reads "Name. What I use it for." Otherwise it reads "Point at or tap a technology to see what I use it for." The caption reserves its height (two lines below 40rem), so nothing below moves. Below 40rem a picked note becomes a Paper card that sticks to the bottom of the screen, so it stays in view in the tall section.
- **Screen readers:** each pill's name includes its note, so the caption is `aria-hidden`.

### Intro Facts
Part of the page under the bio, not a card: no fill, one Hairline above, 2.5rem below the bio. It holds what someone hiring checks first and the rest of the page doesn't say. It is a `<dl>` of three columns 1.5rem apart, stacked below 40rem. The owner asked for it to blend in after a Panel version stood out as a box.
- **Studying:** BS Computer Science, then STI College Ortigas-Cainta and "Class of 2027" on their own lines.
- **Open to:** full-stack and backend, internship or junior roles.
- **Local time:** the live time in Antipolo, then "Antipolo, Philippines · UTC+8". The time is filled in on the client, so the static build never freezes one, and its line is reserved so nothing shifts.
- **Type:** a Slate label at 0.8125rem, the value in Ink Sans 500 at 0.9375rem, the detail in Graphite at 0.875rem. There is no motion.
- **Résumé:** every screen shows exactly one Résumé button near the top, and it looks the same everywhere: the filled Ink pill (`.resume-button`). From 40rem it ends the navbar. Below 40rem the navbar has no room, so it sits 1.5rem under the bio, before the facts. It opens `public/kurt-denver-chavez-resume.pdf` in a new tab, a copy with no phone number, since anything on the site is public. Contact keeps a Résumé row.
- **Content:** degree, school, graduation, roles and the résumé path live in `src/content/profile.ts`.

### Gesture Panels
Hand-landmark skeletons drawn from real training data. They appear only in the Hand Gesture Control dialog. Recorded landmarks are Ink dots at 0.3 opacity. Mean-pose bones are Signal Blue at 1.5px. Joints are Panel-filled with blue strokes. Each panel carries a Micro Graphite label: the gesture name in Mono Ink over the sample count.

## Do's and Don'ts

### Do:
- **Do** present each featured project as a hairline row (serif name, year and arrow, one short line, tags) that opens its full story in a hash-keyed dialog.
- **Do** keep the open dialog the only lifted surface: Paper, 18px radius, one soft shadow, 40% ink backdrop, a bottom sheet below 40rem.
- **Do** make links Ink with a Hairline Strong underline that darkens on hover over 160ms.
- **Do** separate sections with space (5rem to 6.5rem between sections), and keep hairlines for lists.
- **Do** set names in Instrument Serif 400, code and file names in JetBrains Mono 400, and everything else in Instrument Sans.
- **Do** keep Slate text on Paper and use Graphite or Ink inside panels.
- **Do** keep motion to 160ms colour changes, the 200ms dialog rise and the pausable tech strip, and turn the rise and the strip off under `prefers-reduced-motion`.

### Don't:
- **Don't** add a header bar, navigation, numbered sections or tables.
- **Don't** box tags or turn them into pills; tags are plain text joined by middle dots. The dialog's Close button is the only pill.
- **Don't** use blue for links or decoration, or add a second accent colour.
- **Don't** put a shadow on anything but the open dialog, and don't lift anything on hover.
- **Don't** add a dark mode; the system is light only by design.
- **Don't** put a label, kicker or eyebrow above the name, a section title, a project name or a dialog title.
- **Don't** set sans text larger than 1rem or use the serif for anything but names.
- **Don't** add page-load or scroll-triggered entrance animations, or autoplaying media.
