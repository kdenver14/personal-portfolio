import type { ReactNode } from "react";
import { DEGREE, LOCATION, OPEN_TO, OPEN_TO_LEVEL, SCHOOL, TIME_ZONE_LABEL } from "@/content/profile";
import { HomeTime } from "./home-time";

interface Fact {
  label: string;
  value: ReactNode;
  detail: string;
}

const FACTS: readonly Fact[] = [
  { label: "Studying", value: DEGREE, detail: SCHOOL },
  { label: "Open to", value: OPEN_TO, detail: OPEN_TO_LEVEL },
  { label: "Local time", value: <HomeTime />, detail: `${LOCATION} · ${TIME_ZONE_LABEL}` },
];

/** What someone hiring checks first and the rest of the page doesn't say: where I study, what I'm open to, my time. */
export function IntroFacts() {
  return (
    <dl className="panel facts">
      {FACTS.map((fact) => (
        <div key={fact.label} className="facts-item">
          <dt className="facts-label">{fact.label}</dt>
          <dd className="facts-value">{fact.value}</dd>
          <dd className="facts-detail">{fact.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
