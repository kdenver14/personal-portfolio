import { FEATURED } from "@/content/featured";
import { GITHUB_REPOS_URL } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { replayFor } from "@/content/replays";
import { LinkArrow } from "./link-arrow";
import { MoreProjectDetail } from "./more-project-detail";
import { ProjectDialog } from "./project-dialog";

const FEATURED_REPOS = new Set(FEATURED.map((project) => project.repo));
const MORE = PROJECTS.filter((project) => !FEATURED_REPOS.has(project.repo)).map((project) => ({
  project,
  replay: replayFor(project.repo),
}));

/** Six more repos as rows, each opening a replay pop-up. The rest are on GitHub. */
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
            <span className="more-arrow" aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ul>
      <a className="more-all" href={GITHUB_REPOS_URL} target="_blank" rel="noopener noreferrer">
        View more projects
        <LinkArrow />
      </a>
      {MORE.map(({ project, replay }) => (
        <ProjectDialog key={replay.id} id={replay.id} compact>
          <MoreProjectDetail project={project} replay={replay} />
        </ProjectDialog>
      ))}
    </>
  );
}
