import type { Role } from "@/domain/datasheet";
import { EXPERIENCE } from "@/content/experience";
import { formatMonthRange } from "@/lib/format";
import { TagList } from "./project-meta";

function RoleEntry({ role }: { role: Role }) {
  return (
    <li className="role">
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

export function Experience() {
  return (
    <ol className="roles">
      {EXPERIENCE.map((role) => <RoleEntry key={`${role.company}-${role.start}`} role={role} />)}
    </ol>
  );
}
