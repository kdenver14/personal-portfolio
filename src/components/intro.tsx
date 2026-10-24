import { BIO, LOCATION_SHORT, NAME, ROLE } from "@/content/profile";
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
      <IntroFacts />
    </section>
  );
}
