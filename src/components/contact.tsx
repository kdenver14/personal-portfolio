import { EMAIL_DOMAIN, EMAIL_URL, EMAIL_USER, GITHUB_URL, LINKEDIN_URL } from "@/content/profile";
import { CopyEmail } from "./copy-email";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function Arrow() {
  return (
    <span className="contact-arrow" aria-hidden="true">
      ↗
    </span>
  );
}

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
        <li>
          <a href={GITHUB_URL} {...EXTERNAL}>
            GitHub
            <Arrow />
          </a>
        </li>
        <li>
          <a href={LINKEDIN_URL} {...EXTERNAL}>
            LinkedIn
            <Arrow />
          </a>
        </li>
      </ul>
    </>
  );
}
