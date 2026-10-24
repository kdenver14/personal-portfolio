import type { ReactNode } from "react";
import { DEGREE, GRADUATION, LOCATION, OPEN_TO, OPEN_TO_LEVEL, SCHOOL, TIME_ZONE_LABEL } from "@/content/profile";
import { HomeTime } from "./home-time";

interface Fact {
  label: string;
  value: ReactNode;
  details: readonly string[];
}

const FACTS: readonly Fact[] = [
  { label: "Studying", value: DEGREE, details: [SCHOOL, GRADUATION] },
  { label: "Open to", value: OPEN_TO, details: [OPEN_TO_LEVEL] },
  { label: "Local time", value: <HomeTime />, details: [`${LOCATION} · ${TIME_ZONE_LABEL}`] },
];

/** What someone hiring checks first and the rest of the page doesn't say: where I study, what I'm open to, my time. */
export function IntroFacts() {
  return (
    <dl className="facts">
      {FACTS.map((fact) => (
        <div key={fact.label} className="facts-item">
          <dt className="facts-label">{fact.label}</dt>
          <dd className="facts-value">{fact.value}</dd>
          {fact.details.map((detail) => (
            <dd key={detail} className="facts-detail">
              {detail}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}
