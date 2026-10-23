export interface Language {
  id: string;
  name: string;
  /** Percent of code across the public repos, from GitHub's per-repo language bytes, rounded. */
  share: number;
  /** What I use it for, in one line. */
  note: string;
}

/**
 * The stops on the intro's language line after home: C++ first, the language I started on, and TypeScript last, what I
 * write most now. Shares as of October 2026 across 18 public repos, not counting this site; HTML, CSS and JS make up
 * the rest.
 */
export const LANGUAGES: readonly Language[] = [
  { id: "cpp", name: "C++", share: 21, note: "Where I started. Memory, operators, data structures." },
  { id: "py", name: "Python", share: 21, note: "MediaPipe, Keras, Selenium." },
  { id: "cs", name: "C#", share: 8, note: "ASP.NET Core and EF Core." },
  { id: "ts", name: "TypeScript", share: 35, note: "Most of what I write. Next.js, Express 5, Prisma." },
];
