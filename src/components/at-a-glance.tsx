import { LONGEST_STREAK } from "@/content/activity";
import { LANGUAGE_SHARES, OPEN_SOURCE, SHARE_REPO_COUNT, WEB_SHARE, proofFor } from "@/content/glance";
import { AVAILABILITY, EMAIL_URL, GITHUB_URL, LINKEDIN_URL, LOCATION, TIME_ZONE_LABEL } from "@/content/profile";
import { GlanceFocus } from "./glance-focus";
import { HomeTime } from "./home-time";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

function ProofLink({ repo }: { repo: string }) {
  const proof = proofFor(repo);
  return (
    <a href={proof.href} {...(proof.external ? EXTERNAL : {})}>
      {proof.name}
      {proof.external && " ↗"}
    </a>
  );
}

/** A GitHub-style bar of the real code share, then each language with what it's used for and the projects that prove it. */
function LanguageBoard() {
  return (
    <GlanceFocus className="glance-board">
      <div className="glance-bar" aria-hidden="true">
        {LANGUAGE_SHARES.map((language) => (
          <span key={language.name} className="glance-segment" data-lang={language.name} style={{ flexGrow: language.share }} />
        ))}
        <span className="glance-segment" style={{ flexGrow: WEB_SHARE }} />
      </div>
      <ul className="glance-languages">
        {LANGUAGE_SHARES.map((language) => (
          <li key={language.name} className="glance-language" data-lang={language.name}>
            <p className="glance-language-name">
              <span className="glance-swatch" aria-hidden="true" />
              {language.name}
              <span className="glance-share tabular">{language.share}%</span>
            </p>
            <p className="glance-use">{language.use}</p>
            <ul className="glance-proof">
              {language.repos.map((repo) => (
                <li key={repo}>
                  <ProofLink repo={repo} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </GlanceFocus>
  );
}

/**
 * The intro's summary for someone hiring: what I'm open to, where and when I am, what I write with the projects that
 * prove it, and how to reach me. Every fact is in the HTML at load; motion is only a hover dim.
 */
export function AtAGlance() {
  return (
    <section className="panel glance" aria-labelledby="glance-title">
      <h2 id="glance-title" className="glance-kicker">
        At a glance
      </h2>
      <p className="glance-lead">{AVAILABILITY}</p>
      <p className="glance-meta">
        {LOCATION} · {TIME_ZONE_LABEL}
        <HomeTime prefix=" · " suffix=" there now" />
      </p>
      <LanguageBoard />
      <p className="glance-source">
        <span className="glance-swatch" aria-hidden="true" />
        HTML, CSS and JS {WEB_SHARE}%, the front ends. Shares are of code across my {SHARE_REPO_COUNT} public repos on GitHub.
      </p>
      <div className="glance-foot">
        <p className="glance-facts">
          <span>
            Open source:{" "}
            <a href={OPEN_SOURCE.href} {...EXTERNAL}>
              {OPEN_SOURCE.label}
            </a>
          </span>
          {LONGEST_STREAK && <span>Longest streak: {LONGEST_STREAK.days} days</span>}
          <span>
            Building: <ProofLink repo="uptime-monitor" />
          </span>
        </p>
        <p className="glance-links">
          <a href={EMAIL_URL}>Email</a>
          <a href={GITHUB_URL} {...EXTERNAL}>
            GitHub
          </a>
          <a href={LINKEDIN_URL} {...EXTERNAL}>
            LinkedIn
          </a>
        </p>
      </div>
    </section>
  );
}
