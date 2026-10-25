import type { FeaturedProject } from "@/domain/datasheet";
import { STATUS_LABEL } from "@/content/projects";

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
