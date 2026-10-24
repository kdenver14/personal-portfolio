"use client";

import { useSyncExternalStore } from "react";
import { SITE_TITLE } from "@/content/profile";

const LINKS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
] as const;
/** Every section heading in page order, including ones without a link, so a section between links lights none. */
const SECTIONS = ["stack", "projects", "experience", "activity", "more-projects", "contact"];
/** A section counts as current once its heading rises above this share of the viewport. */
const ACTIVE_LINE = 0.3;
const TOP_ID = "intro-name";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/** Within this many px of the page end, the last section counts as current even if its heading sits low. */
const BOTTOM_SLACK = 2;

/** The last section whose heading has passed the active line, or the last one once the page can't scroll further. */
function currentSection(): string | null {
  const root = document.documentElement;
  if (window.scrollY + window.innerHeight >= root.scrollHeight - BOTTOM_SLACK) {
    return SECTIONS.at(-1) ?? null;
  }
  const line = window.innerHeight * ACTIVE_LINE;
  return SECTIONS.findLast((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= line) ?? null;
}

/** A floating pill, clear of the top edge, linking to the page's sections and marking the one in view. */
export function NavBar() {
  const current = useSyncExternalStore(subscribe, currentSection, () => null);
  return (
    <nav className="navbar" aria-label="Sections">
      <a className="navbar-brand" href={`#${TOP_ID}`}>
        {SITE_TITLE}
      </a>
      <ul className="navbar-links">
        {LINKS.map((link) => (
          <li key={link.id}>
            <a className="navbar-link" href={`#${link.id}`} aria-current={current === link.id ? "true" : undefined}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
