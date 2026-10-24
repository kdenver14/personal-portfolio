import { BIO, LOCATION_SHORT, NAME, RESUME_URL, ROLE } from "@/content/profile";
import { IntroFacts } from "./intro-facts";

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
      </div>
      {/* Phones only: from 40rem the navbar carries the same button, on the same first screen. */}
      <p className="intro-resume">
        <a className="resume-button" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </p>
      <IntroFacts />
    </section>
  );
}
