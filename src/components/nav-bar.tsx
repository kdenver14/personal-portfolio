"use client";

import { useSyncExternalStore } from "react";
import { RESUME_URL, SITE_TITLE } from "@/content/profile";

const LINKS = [
  { id: "technologies", label: "Technologies", short: "Tech" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
] as const;
/** Every section heading in page order, including ones without a link, so a section between links lights none. */
const SECTIONS = ["technologies", "projects", "experience", "activity", "more-projects", "contact"];
/** A section counts as current once its heading rises above this share of the viewport. */
const ACTIVE_LINE = 0.3;
/** No element has this id, so the browser scrolls to the very top: the intro alone, as on a first visit. */
const TOP_HASH = "#top";

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
      <a className="navbar-brand" href={TOP_HASH}>
        {SITE_TITLE}
      </a>
      <ul className="navbar-links">
        {LINKS.map((link) => (
          <li key={link.id}>
            <a className="navbar-link" href={`#${link.id}`} aria-current={current === link.id ? "true" : undefined}>
              {"short" in link ? (
                <>
                  <span className="navbar-label-full">{link.label}</span>
                  <span className="navbar-label-short">{link.short}</span>
                </>
              ) : (
                link.label
              )}
            </a>
          </li>
        ))}
        {/* Desktop only: phones reach the résumé from the intro and Contact, and their navbar is full. */}
        <li className="navbar-resume-item">
          <a className="resume-button" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Résumé
          </a>
        </li>
      </ul>
    </nav>
  );
}
