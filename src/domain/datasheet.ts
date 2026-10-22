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
  /** The animated mini demo in the project's pop-up. */
  demo: Demo;
  video?: ProjectVideo;
  listing?: Listing;
}

export interface GestureSet {
  gesture: string;
  recorded: number;
  /** samples[sample][landmark] = [x, y], wrist-relative, y grows downward. */
  samples: readonly (readonly (readonly [number, number])[])[];
}

/** Output colour in a terminal replay: plain, or a success line. */
export type TerminalTone = "plain" | "ok";

/**
 * One beat of a terminal replay. `cmd` is typed at the prompt; `out` is a line the program really prints;
 * `note` is narration about what happens off-screen, shown as a muted comment and never as output.
 */
export type TerminalStep =
  | { readonly cmd: string }
  | { readonly out: string; readonly tone?: TerminalTone }
  | { readonly note: string }
  | { readonly wait: number };

export interface WindowField {
  readonly label?: string;
  readonly placeholder?: string;
  readonly value: string;
}

export interface WindowItem {
  readonly text: string;
  readonly meta?: string;
  /** Button labels drawn beside the item, e.g. ["Save", "Delete"]. */
  readonly actions?: readonly string[];
}

/** What a mock app window shows at one moment. */
export interface WindowState {
  readonly heading: string;
  readonly fields?: readonly WindowField[];
  /** Label of the form's main button. */
  readonly action?: string;
  readonly items?: readonly WindowItem[];
  /** Large readout, such as a timer. */
  readonly display?: string;
  readonly marks?: string;
  readonly status?: string;
}

/**
 * One beat of a window replay: type into an empty field (the last by default), type onto the end of a
 * field or list item, patch the window, or hold.
 */
export type WindowStep =
  | { readonly type: string; readonly field?: number }
  | { readonly append: string; readonly field: number }
  | { readonly append: string; readonly item: number }
  | { readonly set: Partial<WindowState>; /** Ms to hold afterwards; defaults to a beat. */ readonly hold?: number }
  | { readonly wait: number };

interface ReplayBase {
  /** URL hash that opens the project's pop-up. */
  readonly id: string;
  readonly repo: string;
  /** Title bar text, such as the file being run or the app's name. */
  readonly title: string;
  /** What the replay shows, in one or two sentences: the text alternative to the animation. */
  readonly description: string;
}

/** A short scripted replay of a project, built from its repository's code with sample values. */
export type Replay =
  | (ReplayBase & { readonly kind: "terminal"; readonly steps: readonly TerminalStep[] })
  | (ReplayBase & { readonly kind: "window"; readonly initial: WindowState; readonly steps: readonly WindowStep[] })
  | (ReplayBase & { readonly kind: "pong"; readonly seconds: number; /** Game seconds per replay second. */ readonly speed: number });

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** One request through an API's layers, as the code handles it. Bodies are samples, shortened with …. */
export interface DemoRequest {
  readonly method: HttpMethod;
  readonly path: string;
  readonly headers?: readonly string[];
  readonly body?: string;
  /** The stops the request passes through, in order, by index into the demo's stops. */
  readonly visits: readonly number[];
  /** The stop that sends the response; the request travels back to it from the last visit. */
  readonly answeredAt: number;
  readonly status: number;
  /** The response body as the code writes it; omitted when there is none. */
  readonly response?: string;
}

export type SortAlgorithm = "bubble" | "selection";

/** One sort from the repo, on the array in its own main(). */
export interface SortRun {
  readonly algorithm: SortAlgorithm;
  readonly file: string;
  readonly values: readonly number[];
}

export type GestureMode = "DRAW" | "VOLUME" | "CLICK";

/** A hand pose held long enough to act on: the gesture it is read as, the mode it leaves, and what happens. */
export interface GestureBeat {
  readonly gesture: string;
  readonly mode: GestureMode;
  readonly action: string;
}

interface DemoBase {
  /** What the demo shows, in a sentence or two: the text alternative to the animation. */
  readonly description: string;
}

/** A featured project's animated mini demo, drawn from its repository's code. */
export type Demo =
  | (DemoBase & { readonly kind: "requests"; readonly stops: readonly string[]; readonly requests: readonly DemoRequest[] })
  | (DemoBase & { readonly kind: "sort"; readonly runs: readonly SortRun[] })
  | (DemoBase & {
      readonly kind: "gesture";
      readonly stops: readonly string[];
      readonly initialMode: GestureMode;
      readonly beats: readonly GestureBeat[];
    });
