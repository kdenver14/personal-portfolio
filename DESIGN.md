---
name: KDC-14
description: The one-page portfolio of Kurt Denver Chavez, a calm light column with a serif name, soft-panel project cards that open into dialogs, and one DIP-8 chip figure.
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
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1.1
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
  mark:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.7
  mono-pin:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.2
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
  chip-top: "3rem"
  card-gap: "1rem"
  card-padding: "1.25rem 1.25rem 1.125rem"
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
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.25rem 1.25rem 1.125rem"
  card-hover:
    backgroundColor: "{colors.panel-hover}"
  card-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  card-summary:
    textColor: "{colors.ink-2}"
    typography: "{typography.summary}"
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
  flow-node:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.node}"
    padding: "0.4rem 0.875rem"
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
  pin-active:
    textColor: "{colors.blue}"
  footer:
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
    padding: "1.75rem 0 3rem"
---

# Design System: KDC-14

## Overview

**Creative North Star: "The Quiet Column"**

One narrow column on a cool near-white with a faint blue cast, about 640px, read top to bottom like a well-made personal page. It runs name, short bio, availability, three links (Email, GitHub, LinkedIn), a sliding strip of technology logos, the chip, four project cards, experience, every other repo, and how to reach them. Instrument Serif at 400 carries the voice moments: the 40px name, card titles and dialog titles. Instrument Sans carries everything else at small, even sizes. JetBrains Mono appears only where the content is literally code, a file name or a chip marking.

The owner's standing steer governs every surface: "not too bold, professionalism with taste". The page stays a summary. Each featured project is a soft blue-gray card (14px radius) with a serif title, year, one short summary, tags and "View project". The card opens a native dialog keyed to the URL hash, and the full story lives there. That story is the overview, gesture data or a code listing, a "How it works" flow, a Details list and the source link. Whitespace groups the page. Hairlines appear only in lists: More projects, the dialog's Details, the dialog foot and the footer.

The DIP-8 chip figure is the only signature and the only place the old datasheet idea survives. Light only, by design (`color-scheme: light`).

**Key Characteristics:**
- Cool near-white page with a faint blue cast, near-black ink, two quieter greys, blue-gray hairlines.
- Visuals and project cards sit in soft Panel fills with a 14px radius. The dialog is the one Paper surface lifted off the page.
- Serif for names and titles, sans for everything else, mono only for literal code and markings.
- Links are ink with a light blue-gray underline that darkens on hover. Blue is not a link colour.
- Blue, the only accent, marks focus, the active pin, the gesture skeletons and one status word.
- One shadow in the system, on the open dialog.
- Motion is a 160ms colour change, plus a 200ms dialog rise and a pausable 45s tech strip. Both of those stop under reduced motion.

## Colors

A grey-ink palette on a cool near-white with a faint blue cast, the owner's "not too white" ground. Panels and hairlines are blue-gray, and the tint complements Signal Blue. One saturated blue, the only accent, marks focus, the data being pointed at and a single status.

### Primary
- **Signal Blue** (`blue`): the focus ring, the active pin's leg and name in the chip figure, the bones and joint strokes of the gesture skeletons, and the "In development" status word on a card and in a dialog head. It means "this is focused", "this is the data you are pointing at" or "this is still being built".

### Neutral
- **Paper** (`paper`): the page, the dialog surface, the Close pill, flow-diagram nodes and the theme colour.
- **Ink** (`ink`): the name, card and dialog titles, links, the availability line, code, and text selection (ink background, paper text). At 40% it is the dialog backdrop.
- **Graphite** (`ink-2`): the role line, bio, card summaries, card and dialog meta and tags, the tech strip, dialog overview text, the contact line, pin sublabels, the pin readout, captions inside panels, code-listing line numbers and comments, and gesture labels.
- **Slate** (`ink-3`): section titles, dialog sub-headings ("How it works", "Details"), fact labels, the strip's logos, More projects years, the footer, and captions on Paper.
- **Hairline** (`line`): row rules in More projects and Details, the rule above the dialog foot, the footer's top rule, flow-node borders and the Close pill's resting border.
- **Hairline Strong** (`line-strong`): resting link underlines, connectors between flow nodes, the tech strip's dot separators and the Close pill's hover border.
- **Panel** (`panel`): the fill of every project card, the chip panel, flow and code panels, and the placeholder fill of a demo video. A hovered card steps one notch darker to Panel Hover.
- **Panel Hover** (`panel-hover`): the fill of a hovered project card, and nothing else.

### Named Rules
**The Slate On Paper Rule.** Slate (`ink-3`) sits on Paper only. It clears AA on Paper (4.97:1) but only just clears it on Panel (4.57:1) and falls below it on a hovered card (4.25:1). Text inside a panel or card uses Graphite (5.19:1 on Panel, 4.82:1 on a hovered card) or Ink, which is why card meta and tags are Graphite.

**The One Signal Rule.** Signal Blue is the only accent. It marks focus, the active pin, the gesture bones and the "In development" status word (5.22:1 on Panel, 4.85:1 on a hovered card). It is never decoration, a heading colour, a link colour or a fill.

## Typography

**Display Font:** Instrument Serif 400 (with Georgia, serif).
**Body Font:** Instrument Sans (with Helvetica Neue, Arial, sans-serif).
**Label/Mono Font:** JetBrains Mono 400 (with ui-monospace, Menlo, monospace).

**Character:** A narrow, bookish serif sets every name on the page. A clean grotesque at small, even sizes carries everything else. The serif provides warmth and scale. The sans stays quiet and does the reading work.

### Hierarchy
- **Display** (Serif 400, 2.5rem, line-height 1.05, tracking -0.01em): the name, once per page.
- **Headline** (Serif 400, 2.25rem, line-height 1.05): the project name at the top of its dialog.
- **Title** (Serif 400, 1.625rem, line-height 1.1): card titles.
- **Body** (Sans 400, 1rem, line-height 1.65): bio, dialog overview, contact line. The 40rem column holds lines near 75ch.
- **Summary** (Sans 400, 0.9375rem, line-height 1.55): the one-line summary on a card.
- **Body List** (Sans 400, 0.9375rem, line-height 1.5): More projects rows (names at 500), Details facts (line-height 1.45) and the tech strip.
- **Label** (Sans 500, 0.875rem, line-height 1.4, Slate, sentence case): section titles and dialog sub-headings. These are real headings, not kickers over another heading. "View project" and the Close pill use the same size and weight in Ink.
- **Small** (Sans 400, 0.875rem): project meta, status and tags.
- **Caption** (Sans 400, 0.8125rem, line-height 1.5): panel captions (centred, Graphite), the video caption (Slate), fact labels, flow nodes and the footer.
- **Micro** (Sans 400, 0.75rem): pin sublabels, gesture labels, code inside panel captions.
- **Mark** (Sans 700, 1rem, tracking 0.06em): KDC-14 on the chip body only.
- **Mono** (400, 0.8125rem, line-height 1.7): code listings, file names and code values in Details. Pin names are Mono at 0.875rem. Chip numerals and the date code are 0.6875rem.

### Named Rules
**The Serif Names Rule.** Instrument Serif sets names only: the person, a card title and a dialog title. It is always weight 400, and only the serif goes above 1rem. Sans text stays between 0.75rem and 1rem, and its emphasis comes from weight (500 for links, labels and list names) and from moving between Ink, Graphite and Slate.

**The Literal Mono Rule.** JetBrains Mono is for text that is literally code, a file name, a gesture name, a pin name or a chip marking (numerals, date code, readout key). It is always weight 400 and never used for prose, labels or headings. The KDC-14 mark is sans, not mono.

## Layout

One centred column, max width 40rem plus a 1.25rem gutter each side, at every viewport. There is no header bar and no navigation. The page starts 4.5rem from the top, or 7.5rem at 48rem and up, with the name first and nothing above it.

Vertical rhythm comes from space. Sections sit 5rem apart, or 6.5rem at 48rem and up. A section title sits 1.75rem above its content. In the intro, the link row sits 1.5rem below the bio, the tech strip 2.5rem below the links, and the chip panel 3rem below the strip. The footer sits 6rem below the last section.

Projects are a grid of cards inside the column: one column below 40rem, two equal columns from 40rem, with a 1rem gap. Cards in a row share a height, and "View project" pins to each card's foot.

The project dialog is up to 44rem wide (always 1rem clear of each viewport edge) and at most 90dvh tall (capped at 64rem). It scrolls inside itself. Its body has 1.5rem side padding, or 2.5rem from 40rem, and 1.75rem between blocks. "How it works" and Details sit side by side from 40rem with a 2rem gap, and stack below that. Below 40rem the dialog becomes a bottom sheet: full width, up to 92dvh, attached to the bottom edge. The page behind an open dialog does not scroll.

Rows that pair a name with a year (card head, dialog head, More projects rows) put the name left and the year right, aligned on the baseline. The breakpoints are 40rem (card grid, dialog sheet, detail grid, gesture panels from three to five across, More projects rows from two lines to 11rem name, description and year) and 48rem (page-top and section spacing).

### Named Rules
**The Space Groups Rule.** Group with whitespace and the panel fill. Hairlines are for lists only: More projects rows, the Details facts, the rule above the dialog foot and the footer. Never put dividers between sections or between cards.

**The Summary And Story Rule.** The page carries a summary of each project. The full story (media, overview, figures, flow, facts and source) lives in that project's dialog, reachable by URL hash.

## Elevation & Depth

Nearly flat. The page has one tonal step: blue-gray Panel on cool Paper, with Paper flow nodes inside a panel where a diagram needs them. A hovered card darkens one notch to Panel Hover. The only lifted surface is the open dialog. It is Paper over a 40% ink backdrop and carries a single soft, diffuse shadow (exact value in the sidecar). The dialog's sticky bar fades from paper to transparent so content scrolls under the Close pill. Focus is a 2px blue outline with a 3px offset, not a glow.

### Named Rules
**The One Lift Rule.** The modal dialog is the only element with a shadow and a backdrop. Cards, panels, the chip and buttons stay flat. Hover changes tone, never elevation.

## Shapes

Soft and consistent. Cards, panels and the demo video share a 14px radius. The dialog is slightly rounder at 18px, and only its top corners round when it becomes a bottom sheet. Flow nodes and a card's video poster use 8px. The Close button is a full pill (999px), the only pill in the system. The focus ring rounds to 2px. Text, links, tags, lists and the footer have no frames.

The chip figure draws its own hardware. The package body has 3px corners, the notch is a half-round cut, and the pin-1 dot is a circle. Pin legs are small rectangles open on the side that meets the package. These shapes and the chip's own greys (body, dot, legs, numerals, marking) are drawing material. They do not join the radius scale or the palette.

## Components

### Links
Quiet, underlined, ink.
- **Default:** Ink text with a 1px Hairline Strong underline, offset 0.25em. The underline turns to the text colour on hover over 160ms.
- **Link row** (intro Email and GitHub, contact links, "Source on GitHub"): weight 500. Intro links run inline with 1.5rem gaps. Contact links stack with 0.375rem gaps.
- **List name** (More projects only): weight 500 with no underline at rest. The underline appears on hover.
- **Focus:** a 2px Signal Blue outline, 3px offset, 2px radius, everywhere.

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

### Project Card
The whole card is one link to its dialog (`#project-id`). Panel fill, 14px radius, padding 1.25rem with 1.125rem at the foot, and 0.5rem between rows. The order is: a serif Title with the year (Graphite, tabular figures) on the right; a Signal Blue "In development" when it applies; a Graphite Summary; Graphite tags; and "View project" (Ink, 500, 0.875rem) at the foot. On hover the fill darkens one notch over 160ms. A video poster at 8px radius leads the card when a demo exists.

### Project Dialog
A native modal `<dialog>` opened from the URL hash. A direct link opens it, and Back closes it. Escape, a backdrop click and the Close pill also close it. It is a Paper surface with an 18px radius, the system's one shadow and a 40% ink backdrop. It rises 12px and fades in over 200ms on the house ease-out, with no animation under reduced motion. A sticky bar at the top holds the Close pill on the right. The body runs in this order:
- the head: Headline serif name with status and year;
- the video when present;
- the Graphite overview;
- the gesture panels or the code listing;
- a two-up grid of "How it works" (Flow Diagram) and Details (Facts);
- the foot: tags on the left and "Source on GitHub" on the right, under a hairline.

### Facts (Details)
A hairline definition list. There is a top rule on the list, then each fact has a 1px Hairline bottom rule and 0.625rem vertical padding. The Slate Caption label sits over the Ink value. Code values are Mono at 0.8125rem and break anywhere. The tight padding is deliberate list density.

### Tags
Plain text at 0.875rem in Graphite, on cards and in the dialog foot. Middle dots trail each tag, so a wrapped line never starts with a dot. There are no boxes, pills or fills.

### Tech Strip
A single line of monochrome technology logos, sliding right to left in a 45s linear loop.
- **Logos:** 1.75rem square, Slate fill turning Ink on hover, 2.5rem apart. Each is one SVG path: Simple Icons (CC0), or Devicon (MIT) for C#.
- **Names:** each logo carries its name as an accessible label and a native tooltip.
- **Loop:** the list is drawn twice so the loop has no seam, and the copy is hidden from assistive tech. Both edges fade out through a 12% mask.
- **Pausing:** none. By the owner's choice it never pauses, not even on hover, and has no Pause button.
- **Reduced motion:** the strip stops, loses the mask and wraps as a static grid of logos.

### Demo Video (slot)
None is populated yet. When present, it leads the dialog at full width, with the 14px radius and a Panel fill before load, and its poster leads the card. It has native controls and never autoplays. A visible Slate caption sits 0.625rem below it as the text alternative.

### Flow Diagram
A vertical chain of Paper nodes (8px radius, 1px Hairline border, Caption type, centred, minimum 10rem wide) joined by 1px Hairline Strong connectors, centred in a panel. It appears under "How it works" in a dialog.

### Code Listing
A panel with a head row above a Mono body at line-height 1.7. The head holds the file name in Mono Graphite and a "View file" link. Long lines wrap with a hanging indent under the code, so phones never scroll or clip a listing. Line numbers are generated, right-aligned in Graphite, and unselectable. Comments are Graphite.

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
  - A soft Signal Blue streak, 3.5rem long, runs down the rail one role per 1.5s slice.
  - Each dot's ring turns full blue and gives off a small halo as the streak reaches it, then fades.
  - The cycle is one slice per role plus one slice of rest. With three roles that is 6s.
  - Under reduced motion the timeline is still.

### More Projects List
A hairline list. There is a top rule on the first row, then each row has a 1px Hairline bottom rule and 0.75rem vertical padding. The tight row padding is deliberate list density, confirmed by the owner. Each row shows the name (500), a one-line description in Graphite and the year in Slate tabular figures.

### Footer
Copyright on the left and the "Updated" month on the right, in Slate Caption type, under a single Hairline. Padding is 1.75rem above and 3rem below.

### Dot Frame (decoration)
A band of grey dots around all four screen edges that reacts to the mouse. It is `src/components/dot-frame.tsx`.
- **Grid:** 18px spacing, anchored to the screen's top-left. Dots are about 3px, in Ink mixed into Paper at 20%.
- **Bands:**
  - The frame is fixed, so it frames the screen while the page scrolls under it.
  - The side bands widen with the margin, `clamp(1.125rem, (100% − measure) / 2 − 2rem, 7rem)`, so they end 2rem short of the text column. On phones that leaves one column of dots.
  - The top and bottom bands are 2.25rem.
  - Every band holds solid for its first 35%, then fades toward the middle.
- **Hover:**
  - Within a soft 15rem circle around the mouse, dots darken to Ink at 55% and grow to about 4px.
  - The circle fades in on the first mouse move and out when the cursor leaves the window, over 300ms.
  - Only a mouse triggers it; touch and pen leave the frame static.
  - The cursor position is written to CSS variables at most once per frame. The lit circle is a small layer whose background is shifted back by its own position, so its dots land exactly on the grid's.
- **Behaviour:** decorative, so `aria-hidden` with no pointer events.

### DIP-8 Pin Figure (signature)
The single signature, in a panel under the tech strip. The dark package body is drawn as a top view, at least 16rem tall. It has a notch, a pin-1 dot and mono pin numbers. The KDC-14 mark (Sans 700, tracking 0.06em) is rotated to run along the body, with a mono date code. Four pins sit on each side. Each pin has a mono name over a Micro Graphite sublabel, and a grey leg. Hovering, focusing or tapping a pin turns its leg and name Signal Blue and its body number white. Its description appears in a centred Graphite readout below. The readout idles on "Me, as an 8-pin chip. Hover or tap a pin." The GH and MAIL pins are real links with underlined names. The CLK pin shows live Philippine time.

### Gesture Panels
Hand-landmark skeletons drawn from real training data. They appear only in the Hand Gesture Control dialog. Recorded landmarks are Ink dots at 0.3 opacity. Mean-pose bones are Signal Blue at 1.5px. Joints are Panel-filled with blue strokes. Each panel carries a Micro Graphite label: the gesture name in Mono Ink over the sample count.

## Do's and Don'ts

### Do:
- **Do** present each featured project as a Panel card (14px radius, 1rem grid gap, two up from 40rem) that opens its full story in a hash-keyed dialog.
- **Do** keep the open dialog the only lifted surface: Paper, 18px radius, one soft shadow, 40% ink backdrop, a bottom sheet below 40rem.
- **Do** make links Ink with a Hairline Strong underline that darkens on hover over 160ms.
- **Do** separate sections and cards with space (5rem to 6.5rem between sections), and keep hairlines for lists.
- **Do** set names in Instrument Serif 400, code, file names and pin names in JetBrains Mono 400, and everything else in Instrument Sans.
- **Do** keep Slate text on Paper and use Graphite or Ink inside panels and cards.
- **Do** keep motion to 160ms colour changes, the 200ms dialog rise and the pausable tech strip, and turn the rise and the strip off under `prefers-reduced-motion`.

### Don't:
- **Don't** add a header bar, navigation, numbered sections or tables.
- **Don't** box tags or turn them into pills; tags are plain text joined by middle dots. The dialog's Close button is the only pill.
- **Don't** use blue for links or decoration, or add a second accent colour.
- **Don't** put a shadow on anything but the open dialog, and don't lift cards on hover.
- **Don't** add a dark mode; the system is light only by design.
- **Don't** put a label, kicker or eyebrow above the name, a section title, a card title or a dialog title.
- **Don't** set sans text larger than 1rem or use the serif for anything but names.
- **Don't** add a second signature figure or extend the chip's hardware styling to other components.
- **Don't** add page-load or scroll-triggered entrance animations, or autoplaying media.
