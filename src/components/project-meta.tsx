import type { FeaturedProject } from "@/domain/datasheet";
import { projectByRepo, STATUS_LABEL } from "@/content/projects";
import { formatYear } from "@/lib/format";

export function ProjectYear({ project }: { project: FeaturedProject }) {
  return <span className="project-year tabular">{formatYear(projectByRepo(project.repo).created)}</span>;
}

/** Only unfinished work is called out; active and complete projects need no label. */
export function ProjectStatus({ project }: { project: FeaturedProject }) {
  return project.status === "preview" ? <span className="status-preview">{STATUS_LABEL.preview}</span> : null;
}

export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="tags" aria-label="Built with">
      {tags.map((tag) => <li key={tag}>{tag}</li>)}
    </ul>
  );
}
