import { FEATURED } from "@/content/featured";
import { GITHUB_REPOS_URL } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { replayFor } from "@/content/replays";
import { formatYear } from "@/lib/format";
import { MoreProjectDetail } from "./more-project-detail";
import { ProjectDialog } from "./project-dialog";

const FEATURED_REPOS = new Set(FEATURED.map((project) => project.repo));
const MORE = PROJECTS.filter((project) => !FEATURED_REPOS.has(project.repo)).map((project) => ({
  project,
  replay: replayFor(project.repo),
}));

/** Six more repos as rows, each opening a replay pop-up; on hover the year gives way to an arrow. The rest are on GitHub. */
export function MoreProjects() {
  return (
    <>
      <ul className="more">
        {MORE.map(({ project, replay }) => (
          <li key={project.repo} className="more-item">
            <a className="more-name" href={`#${replay.id}`} aria-haspopup="dialog">
              {project.name}
            </a>
            <span className="more-desc">{project.function}</span>
            <span className="more-year tabular">
              <span className="more-year-text">{formatYear(project.created)}</span>
              <span className="more-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </li>
        ))}
      </ul>
      <a className="more-all" href={GITHUB_REPOS_URL} target="_blank" rel="noopener noreferrer">
        View more projects <span className="more-all-arrow" aria-hidden="true">↗</span>
      </a>
      {MORE.map(({ project, replay }) => (
        <ProjectDialog key={replay.id} id={replay.id} compact>
          <MoreProjectDetail project={project} replay={replay} />
        </ProjectDialog>
      ))}
    </>
  );
}
