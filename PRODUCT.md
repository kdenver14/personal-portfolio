# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript, statically exported, deployed to Vercel. Chosen by the owner because it is the stack they already maintain (see their Collection-Manager repo).

## Users

Primary: recruiters and engineers screening a CS student for internship or junior developer roles. They arrive from a résumé, LinkedIn, or GitHub link, spend under two minutes, and are deciding whether this person can actually build and reason about software, not just follow tutorials.

## Product Purpose

The personal site of Kurt Denver Chavez (GitHub `kdenver14`, previously `denver2714`), a Computer Science student from Antipolo City, Philippines. It exists to turn a GitHub profile of 26 repos into a clear, credible story: what they built, what they learned building it, and what they are working on now. Success is a screener leaving with one specific project they remember and a way to contact them.

## Positioning

A student who started with C++ and cares about what happens underneath (move semantics, pointer ownership, memory management), who deliberately practices without AI ("No use of AI" on Collection-Manager and Express-Full), and who documents honestly, including unfinished work. The site carries that candor instead of a polished-generic résumé voice.

## Operating Context

Visitors are on desktop between other tabs, or on a phone from a LinkedIn message. They click through to GitHub repos to verify claims. The owner will add projects themselves, so content must live in one typed data file.

## Capabilities and Constraints

- Static site, no backend, no CMS.
- All project facts come from public GitHub repos; links must go to `github.com/kdenver14/<repo>`.
- No live demos are deployed for any project today. The owner is recording demo videos (2026-10-20); featured projects take an optional MP4 with a visible description.
- LinkedIn (added 2026-10-20): https://www.linkedin.com/in/kurt-chavez-952383290/
- Undecided: résumé PDF, custom domain.

## Brand Commitments

- Name: Kurt Denver Chavez. Handle: kdenver14 / "denverplus".
- Contact: GitHub `https://github.com/kdenver14`, email `kurtdenverchavez2005@gmail.com`.
- Voice: casual, honest, a little self-deprecating. Their own bio: "I don't know how I got in this field but it has been fun so far." Code comments mix Taglish ("Pang calculate ng distance between the 2 landmarks naten").
- The owner explicitly does not want the site to look generic or AI-made.
- Standing visual preference (owner, 2026-10-18): "Not too bold or too much when it comes to design, just professionalism with taste." Restraint over spectacle in every future surface.
- Minimalism (owner, 2026-10-20): the full datasheet build read as "messy"; the owner liked the figures and asked for minimalist. Keep one page with hero, selected projects, all projects and contact. No running heads, page breaks, table of contents, revision history or duplicate tables. Cut a section before restyling it.
- Redesign (owner, 2026-10-20): the minimal datasheet still read as "so badly designed": plain like a document, type and spacing off, projects as walls of text. Owner chose a single narrow light column (emilkowal.ski / paco.me), kept the chip figure. Each project: one visual in a soft panel, name and year, one or two sentences, tags, source link.
- Redesign (owner, 2026-10-20, third): fonts changed to Instrument Serif (name, titles) + Instrument Sans + JetBrains Mono. Projects are cards that open a dialog with all of the project's info, so the home page stays uncluttered (owner chose a pop-up over separate pages). A right-to-left strip of monochrome logos for the technologies used in the repos sits under the intro. The owner asked for logos instead of names and for no Pause button, accepting that hover is the only way to pause (a WCAG 2.2.2 gap; reduced motion still stops it).
- Featured projects are the repos pinned on GitHub, in pinned order (2026-10-20): uptime-monitor, Hand-Gesture-Control-Keras-Project, Int-as-integer-data_type, Express-Full.

## Evidence on Hand

- Hand Gesture Control (Python, MediaPipe + Keras): 17 stars, team project with kane-hash and others. Draw / volume / click modes; 5 gestures; 10-frame hold, 2 s cooldown; 7-frame cursor smoothing; 200 samples per gesture; rule-based fallback when no model is trained; macOS volume via `osascript`.
- Collection-Manager (Next.js 16, React 19, Prisma 7, SQLite, shadcn/ui): CRUD for games and users, parallel + intercepting routes for modals, API routes + server actions, service layer. "No AI."
- Express-Full (Express + TypeScript + Prisma): movie watchlist API, JWT auth middleware, hand-written register/login validators, seeded DB, migrations. "Practicing backend without the use of AI."
- uptime-monitor (TypeScript, Express, Prisma, Postgres in Docker): in development; layered controllers / services / repositories / domain; Postgres + Prisma via docker-compose merged Sept 2026.
- Int-as-integer-data_type (C++): `Int` wrapper with full operator overloading, stream operators, division-by-zero checks, variadic-template `ptr_deleter`. 2 stars.
- Game-Store (C#, ASP.NET Core minimal APIs, EF Core, DTOs, migrations), 2024.
- Smaller: auto-clicker (C++), ISS-Tracker, Pomodoro (Tkinter), Pong (turtle), Checking-Stock, Twitter-Complain-Bot, Automatic-bot-reply (Python); Todo-App, Meal-Finder, recipe-manager (React/TS/Zustand); DSA implementations (C++).
- Work experience (from the owner's LinkedIn, 2026-10-20): LOOP Marketers, freelance Telegram automation in Python/Telethon (Jan–Feb 2026); react-hook-form, PR #13262 proposing a useFormDebug hook (closed, not merged; Dec 2025 per LinkedIn); freelance build and dependency fixes (Jan–Mar 2024).
- Absent: screenshots of projects, testimonials, deployed demos, school name, graduation year. Do not fabricate any of these.

## Product Principles

1. Show the work, then the person: every claim links to a repo a screener can open.
2. Candor over polish: in-progress and learning-in-public are features, stated plainly.
3. Specific over impressive: real numbers and real code from their repos beat adjectives.
4. Easy for the owner to extend: adding a project is one entry in one file.

## Accessibility & Inclusion

WCAG 2.2 AA. Keyboard navigable, honors `prefers-reduced-motion`, readable at 390 px wide.
