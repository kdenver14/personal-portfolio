export type ProjectStatus = "active" | "preview" | "complete";

export interface Pin {
  number: number;
  name: string;
  description: string;
  href?: string;
}

export interface Fact {
  label: string;
  value: string;
  /** Set when the value is source code (an identifier, decorator or type), so it renders in mono. */
  code?: true;
}

export interface Listing {
  caption: string;
  language: "python" | "cpp";
  source: string;
  href: string;
}

/** A screen recording served from public/videos/. */
export interface ProjectVideo {
  src: string;
  poster: string;
  /** Pixel size of the recording, so the page reserves the right space before it loads. */
  width: number;
  height: number;
  /** What the recording shows. Doubles as the text alternative, so describe the action, not the file. */
  description: string;
  /** WebVTT file; required when the recording has speech or meaningful sound. */
  captions?: string;
}

export interface Project {
  repo: string;
  name: string;
  function: string;
  language: string;
  /** "YYYY-MM" the repository was created. */
  created: string;
}

/** A monochrome logo drawn from one SVG path. */
export interface TechLogo {
  name: string;
  viewBox: string;
  path: string;
}

export interface Role {
  title: string;
  company: string;
  /** Employment type and place, e.g. ["Freelance", "Remote"]. */
  terms: readonly string[];
  /** "YYYY-MM", inclusive. */
  start: string;
  end: string;
  summary: string;
  skills: readonly string[];
  link?: { label: string; href: string };
}

export interface FeaturedProject {
  id: string;
  repo: string;
  name: string;
  status: ProjectStatus;
  /** One line for the card on the home page. */
  summary: string;
  /** Full description, shown when the project is opened. */
  overview: readonly string[];
  facts: readonly Fact[];
  tags: readonly string[];
  /** Request path through the system, one entry per stage. */
  flow?: readonly string[];
  video?: ProjectVideo;
  listing?: Listing;
}

export interface GestureSet {
  gesture: string;
  recorded: number;
  /** samples[sample][landmark] = [x, y], wrist-relative, y grows downward. */
  samples: readonly (readonly (readonly [number, number])[])[];
}
