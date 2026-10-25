import type { FeaturedProject } from "@/domain/datasheet";
import { ProjectStatus, TagList } from "./project-meta";

/** Home-page row for a project: the name links to its full detail, opened in a dialog through the URL hash. */
export function ProjectRow({ project }: { project: FeaturedProject }) {
  return (
    <li className="project-row">
      <div className="project-row-head">
        <h3 className="project-row-title">
          <a className="project-name" href={`#${project.id}`} aria-haspopup="dialog">
            {project.name}
          </a>
        </h3>
        <span className="project-row-arrow" aria-hidden="true">
          →
        </span>
      </div>
      <ProjectStatus project={project} />
      <p className="project-row-summary">{project.summary}</p>
      <TagList tags={project.tags} />
    </li>
  );
}
