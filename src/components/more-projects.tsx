import type { Project } from "@/domain/datasheet";
import { FEATURED } from "@/content/featured";
import { OWNER } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { replayFor } from "@/content/replays";
import { formatYear, repoUrl } from "@/lib/format";
import { MoreProjectDetail } from "./more-project-detail";
import { ProjectDialog } from "./project-dialog";

const FEATURED_REPOS = new Set(FEATURED.map((project) => project.repo));
const MORE = PROJECTS.filter((project) => !FEATURED_REPOS.has(project.repo));

/** A row opens the project's replay pop-up; one without a replay links straight to GitHub. */
function RowLink({ project }: { project: Project }) {
  const replay = replayFor(project.repo);
  return replay ? (
    <a className="more-name" href={`#${replay.id}`} aria-haspopup="dialog">
      {project.name}
    </a>
  ) : (
    <a className="more-name" href={repoUrl(OWNER, project.repo)} target="_blank" rel="noopener noreferrer">
      {project.name}
    </a>
  );
}

/** Every other repo as a row; on hover the year gives way to an arrow. */
export function MoreProjects() {
  return (
    <>
      <ul className="more">
        {MORE.map((project) => (
          <li key={project.repo} className="more-item">
            <RowLink project={project} />
            <span className="more-desc">{project.function}</span>
            <span className="more-year tabular">
              <span className="more-year-text">{formatYear(project.created)}</span>
              <span className="more-arrow" aria-hidden="true">
                {replayFor(project.repo) ? "→" : "↗"}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {MORE.map((project) => {
        const replay = replayFor(project.repo);
        return replay ? (
          <ProjectDialog key={replay.id} id={replay.id} compact>
            <MoreProjectDetail project={project} replay={replay} />
          </ProjectDialog>
        ) : null;
      })}
    </>
  );
}
