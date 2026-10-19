import { EMAIL_DOMAIN, EMAIL_URL, EMAIL_USER, GITHUB_LABEL, GITHUB_URL, LINKEDIN_LABEL, LINKEDIN_URL } from "@/content/profile";

export function Contact() {
  return (
    <>
      <p className="contact-text">Email is the fastest way to reach me.</p>
      <ul className="contact-links">
        <li>
          {/* <wbr> lets narrow screens break the address before the @ instead of mid-word. */}
          <a href={EMAIL_URL}>
            {EMAIL_USER}
            <wbr />@{EMAIL_DOMAIN}
          </a>
        </li>
        <li>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            {GITHUB_LABEL}
          </a>
        </li>
        <li>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            {LINKEDIN_LABEL}
          </a>
        </li>
      </ul>
    </>
  );
}
