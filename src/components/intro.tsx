import { AVAILABILITY, BIO, EMAIL_URL, GITHUB_URL, LINKEDIN_URL, LOCATION_SHORT, NAME, ROLE } from "@/content/profile";
import { DotGlobe } from "./dot-globe";
import { TechMarquee } from "./tech-marquee";

export function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-name">
      <h1 id="intro-name" className="intro-name">
        {NAME}
      </h1>
      <p className="intro-role">
        {ROLE} · {LOCATION_SHORT}
      </p>
      <div className="intro-bio">
        {BIO.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="intro-availability">{AVAILABILITY}</p>
      </div>
      <ul className="link-row">
        <li>
          <a href={EMAIL_URL}>Email</a>
        </li>
        <li>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
      </ul>
      <TechMarquee />
      <DotGlobe />
    </section>
  );
}
