import { TECH } from "@/content/tech";

/** Each logo gets the same time on screen, so adding logos lengthens the loop instead of speeding the strip up. */
const SECONDS_PER_LOGO = 2.5;

/** The list is rendered twice so the strip can slide by exactly one copy and loop without a seam. */
function LogoList({ copy }: { copy: boolean }) {
  return (
    <ul className="marquee-list" {...(copy ? { "aria-hidden": true } : { "aria-label": "Technologies I use" })}>
      {TECH.map((tech) => (
        <li key={tech.name}>
          <svg className="marquee-logo" viewBox={tech.viewBox} role="img" aria-label={tech.name}>
            <title>{tech.name}</title>
            <path d={tech.path} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Technology logos sliding right to left without pausing; stays still under reduced motion. */
export function TechMarquee() {
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: `${TECH.length * SECONDS_PER_LOGO}s` }}>
        <LogoList copy={false} />
        <LogoList copy />
      </div>
    </div>
  );
}
