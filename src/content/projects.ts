import type { Project, ProjectStatus } from "@/domain/datasheet";

/**
 * The repositories the site shows, newest first: the four featured ones and the six More projects, each of
 * which has a replay. Everything else is one link away on GitHub.
 */
export const PROJECTS: readonly Project[] = [
  { repo: "uptime-monitor", name: "uptime-monitor", function: "Uptime monitor API, in development", language: "TypeScript", created: "2026-08" },
  { repo: "Hand-Gesture-Control-Keras-Project", name: "Hand Gesture Control", function: "Gesture-driven mouse, volume and drawing", language: "Python", created: "2026-02" },
  { repo: "Express-Full", name: "Express-Full", function: "Movie watchlist REST API with JWT auth, without AI", language: "TypeScript", created: "2026-02" },
  { repo: "Collection-Manager", name: "Collection Manager", function: "Games and users CRUD on the Next.js App Router, without AI", language: "TypeScript", created: "2026-01" },
  { repo: "Meal-Finder", name: "Meal Finder", function: "Meal search", language: "TypeScript", created: "2025-04" },
  { repo: "Data-Structure-and-Algorithms-implementation-", name: "DSA implementations", function: "Data structures and algorithms, by hand", language: "C++", created: "2024-08" },
  { repo: "Twitter-Complain-Bot", name: "Twitter Complain Bot", function: "Tweets at the ISP when speed drops below plan", language: "Python", created: "2024-08" },
  { repo: "pong-game", name: "Pong", function: "Pong with turtle graphics and bounce physics", language: "Python", created: "2024-03" },
  { repo: "Int-as-integer-data_type", name: "Int wrapper", function: "Operator-overloaded integer type", language: "C++", created: "2024-03" },
  { repo: "auto-clicker", name: "Auto-clicker", function: "Two-key autoclicker", language: "C++", created: "2024-03" },
];

/** Looks up a repository in the full list; featured entries take their year from here. */
export function projectByRepo(repo: string, projects: readonly Project[] = PROJECTS): Project {
  const project = projects.find((p) => p.repo === repo);
  if (!project) {
    throw new Error(`Unknown repository "${repo}"`);
  }
  return project;
}

export const STATUS_LABEL = {
  active: "Active",
  preview: "In development",
  complete: "Complete",
} as const satisfies Record<ProjectStatus, string>;
