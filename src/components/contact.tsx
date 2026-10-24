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

/*
 * Drawn icons for the rows with no brand logo. Each cut-out winds the opposite way to its outline, so it shows
 * through under the default fill rule.
 */
const ENVELOPE: TechLogo = {
  name: "Email",
  viewBox: "0 0 24 24",
  path: "M2 5h20v14H2V5zm2.5 2L12 11.9 19.5 7h-15zM4 8.6V17h16V8.6L12 14 4 8.6z",
};
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

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function Icon({ icon }: { icon: TechLogo }) {
  return (
    <svg className="contact-icon" viewBox={icon.viewBox} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

/** One row per way to reach me. The name is the link and stretches over its row; Copy sits above it on the email row. */
export function Contact() {
  return (
    <>
      <p className="contact-text">Email is the fastest way to reach me.</p>
      <ul className="contact-links">
        <li className="contact-row">
          <Icon icon={ENVELOPE} />
          <a className="contact-name" href={EMAIL_URL}>
            Email
          </a>
          {/* <wbr> lets narrow screens break the address before the @ instead of mid-word. */}
          <span className="contact-handle">
            {EMAIL_USER}
            <wbr />@{EMAIL_DOMAIN}
          </span>
          <CopyEmail />
        </li>
        {LINKS.map((link) => (
          <li key={link.name} className="contact-row">
            <Icon icon={link.icon} />
            <a className="contact-name" href={link.href} {...EXTERNAL}>
              {link.name}
            </a>
            <span className="contact-handle">{link.handle}</span>
            <LinkArrow />
          </li>
        ))}
      </ul>
    </>
  );
}
