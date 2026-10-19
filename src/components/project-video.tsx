import type { ProjectVideo } from "@/domain/datasheet";

/** A demo recording. Never autoplays; the description is the visible text alternative. */
export function ProjectVideoFigure({ video }: { video: ProjectVideo }) {
  return (
    <figure className="media">
      <video
        className="media-video"
        controls
        playsInline
        preload="metadata"
        poster={video.poster}
        width={video.width}
        height={video.height}
      >
        <source src={video.src} type="video/mp4" />
        {video.captions ? <track kind="captions" src={video.captions} srcLang="en" label="English" default /> : null}
      </video>
      <figcaption className="caption">{video.description}</figcaption>
    </figure>
  );
}
