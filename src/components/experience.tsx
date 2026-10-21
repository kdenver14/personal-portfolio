import type { CSSProperties } from "react";
import type { Role } from "@/domain/datasheet";
import { EXPERIENCE } from "@/content/experience";
import { formatMonthRange } from "@/lib/format";
import { TagList } from "./project-meta";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

/** `--i` is the role's place on the timeline, so its glow starts one slice after the role above it. */
function RoleEntry({ role, index }: { role: Role; index: number }) {
  const place: CSSVars = { "--i": String(index) };
  return (
    <li className="role" style={place}>
      <p className="role-dates tabular">{formatMonthRange(role.start, role.end)}</p>
      <div className="role-body">
        <h3 className="role-title">{role.title}</h3>
        <p className="role-terms">{[role.company, ...role.terms].join(" · ")}</p>
        <p className="role-summary">{role.summary}</p>
        <div className="role-foot">
          <TagList tags={role.skills} />
          {role.link ? (
            <a href={role.link.href} target="_blank" rel="noopener noreferrer">
              {role.link.label}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** `--count` sets the glow's cycle: one slice per role, plus one to rest. */
export function Experience() {
  const timeline: CSSVars = { "--count": String(EXPERIENCE.length) };
  return (
    <ol className="roles" style={timeline}>
      {EXPERIENCE.map((role, i) => <RoleEntry key={`${role.company}-${role.start}`} role={role} index={i} />)}
    </ol>
  );
}
