import type { TechLogo } from "@/domain/datasheet";
import { logoNamed } from "@/content/logos";
import {
  EMAIL_DOMAIN,
  EMAIL_URL,
  EMAIL_USER,
  GITHUB_LABEL,
  GITHUB_URL,
  LINKEDIN_LABEL,
  LINKEDIN_URL,
  RESUME_LABEL,
  RESUME_URL,
} from "@/content/profile";
import { CopyEmail } from "./copy-email";
import { LinkArrow } from "./link-arrow";

/** A page with a folded corner and two lines of text; the inner outline winds the other way, so it cuts out. */
const DOCUMENT: TechLogo = {
  name: "Résumé",
  viewBox: "0 0 24 24",
  path: "M6 2h9l5 5v15H6V2zm2 2v16h10V8h-4V4H8zm2 8h6v1.5h-6v-1.5zm0 3h6v1.5h-6v-1.5z",
};

interface ContactLink {
  name: string;
  handle: string;
  href: string;
  icon: TechLogo;
}

const LINKS: readonly ContactLink[] = [
  { name: "GitHub", handle: GITHUB_LABEL, href: GITHUB_URL, icon: logoNamed("GitHub") },
  { name: "LinkedIn", handle: LINKEDIN_LABEL, href: LINKEDIN_URL, icon: logoNamed("LinkedIn") },
  { name: "Résumé", handle: RESUME_LABEL, href: RESUME_URL, icon: DOCUMENT },
];

export function Contact() {
  return (
    <>
      <p className="contact-text">Email is the fastest way to reach me.</p>
      <div className="contact-email">
        {/* <wbr> lets narrow screens break the address before the @ instead of mid-word. */}
        <a className="contact-address" href={EMAIL_URL}>
          {EMAIL_USER}
          <wbr />@{EMAIL_DOMAIN}
        </a>
        <CopyEmail />
      </div>
      <ul className="contact-links">
        {LINKS.map((link) => (
          <li key={link.name}>
            <a className="contact-link" href={link.href} target="_blank" rel="noopener noreferrer">
              <svg className="contact-icon" viewBox={link.icon.viewBox} aria-hidden="true">
                <path d={link.icon.path} />
              </svg>
              <span className="contact-name">{link.name}</span>
              <span className="contact-handle">{link.handle}</span>
              <LinkArrow />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
