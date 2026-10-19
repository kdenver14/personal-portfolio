import { FEATURED } from "@/content/featured";
import { OWNER } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { formatYear, repoUrl } from "@/lib/format";

const FEATURED_REPOS = new Set(FEATURED.map((project) => project.repo));
const MORE = PROJECTS.filter((project) => !FEATURED_REPOS.has(project.repo));

export function MoreProjects() {
  return (
    <ul className="more">
      {MORE.map((project) => (
        <li key={project.repo} className="more-item">
          <a className="more-name" href={repoUrl(OWNER, project.repo)} target="_blank" rel="noopener noreferrer">
            {project.name}
          </a>
          <span className="more-desc">{project.function}</span>
          <span className="more-year tabular">{formatYear(project.created)}</span>
        </li>
      ))}
    </ul>
  );
}
