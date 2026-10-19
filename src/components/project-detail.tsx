import type { Fact, FeaturedProject } from "@/domain/datasheet";
import { OWNER } from "@/content/profile";
import { repoUrl } from "@/lib/format";
import { CodeListing } from "./code-listing";
import { FlowDiagram } from "./flow-diagram";
import { GestureFigure } from "./gesture-figure";
import { ProjectStatus, ProjectYear, TagList } from "./project-meta";
import { ProjectVideoFigure } from "./project-video";

const GESTURE_PROJECT_ID = "hand-gesture-control";

function Facts({ facts }: { facts: readonly Fact[] }) {
  return (
    <dl className="facts">
      {facts.map((fact) => (
        <div key={fact.label} className="fact">
          <dt>{fact.label}</dt>
          <dd>{fact.code ? <code>{fact.value}</code> : fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Everything about one project, rendered inside its dialog. */
export function ProjectDetail({ project }: { project: FeaturedProject }) {
  return (
    <>
      <header className="detail-head">
        <h2 id={`${project.id}-title`} className="detail-title">
          {project.name}
        </h2>
        <span className="project-meta">
          <ProjectStatus project={project} />
          <ProjectYear project={project} />
        </span>
      </header>
      {project.video ? <ProjectVideoFigure video={project.video} /> : null}
      <div className="detail-text">
        {project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      {project.id === GESTURE_PROJECT_ID ? <GestureFigure /> : null}
      {project.listing ? <CodeListing listing={project.listing} /> : null}
      <div className="detail-grid">
        {project.flow ? (
          <section>
            <h3 className="detail-label">How it works</h3>
            <FlowDiagram steps={project.flow} label={`${project.name}, step by step`} />
          </section>
        ) : null}
        <section>
          <h3 className="detail-label">Details</h3>
          <Facts facts={project.facts} />
        </section>
      </div>
      <footer className="detail-foot">
        <TagList tags={project.tags} />
        <a href={repoUrl(OWNER, project.repo)} target="_blank" rel="noopener noreferrer">
          Source on GitHub
        </a>
      </footer>
    </>
  );
}
