import type { Project, Replay } from "@/domain/datasheet";
import { OWNER } from "@/content/profile";
import { formatYear, repoUrl } from "@/lib/format";
import { ReplayFigure } from "./replay-player";

/** A More project's pop-up: what it is, a short replay of it running, and its source. */
export function MoreProjectDetail({ project, replay }: { project: Project; replay: Replay }) {
  return (
    <>
      <header className="detail-head">
        <h2 id={`${replay.id}-title`} className="detail-title">
          {project.name}
        </h2>
        <span className="project-year tabular">{formatYear(project.created)}</span>
      </header>
      <p className="detail-text">{project.function}</p>
      <ReplayFigure replay={replay} />
      <footer className="detail-foot">
        <ul className="tags" aria-label="Built with">
          <li>{project.language}</li>
        </ul>
        <a href={repoUrl(OWNER, project.repo)} target="_blank" rel="noopener noreferrer">
          Source on GitHub
        </a>
      </footer>
    </>
  );
}
