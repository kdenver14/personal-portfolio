import Image from "next/image";
import type { FeaturedProject } from "@/domain/datasheet";
import { ProjectStatus, ProjectYear, TagList } from "./project-meta";

/** Home-page summary of a project; opens its full detail in a dialog through the URL hash. */
export function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <a href={`#${project.id}`} className="card" aria-haspopup="dialog">
      {project.video ? (
        <Image
          className="card-poster"
          src={project.video.poster}
          alt=""
          width={project.video.width}
          height={project.video.height}
          unoptimized
        />
      ) : null}
      <span className="card-head">
        <h3 className="card-title">{project.name}</h3>
        <ProjectYear project={project} />
      </span>
      <ProjectStatus project={project} />
      <p className="card-summary">{project.summary}</p>
      <TagList tags={project.tags} />
      <span className="card-open" aria-hidden="true">
        View project <span className="card-arrow">→</span>
      </span>
    </a>
  );
}
