import type { Project, ProjectStatus } from "@/domain/datasheet";

/**
 * The repositories the site shows, newest first: the four featured ones and the six More projects, each of
 * which has a replay. Everything else is one link away on GitHub.
 */
export const PROJECTS: readonly Project[] = [
  { repo: "uptime-monitor", name: "uptime-monitor", function: "Website uptime monitor, in development", language: "TypeScript" },
  { repo: "Hand-Gesture-Control-Keras-Project", name: "Hand Gesture Control", function: "Gesture-driven mouse, volume and drawing", language: "Python" },
  { repo: "Express-Full", name: "Express-Full", function: "Movie watchlist REST API with JWT auth, without AI", language: "TypeScript" },
  { repo: "Collection-Manager", name: "Collection Manager", function: "Games and users CRUD on the Next.js App Router, without AI", language: "TypeScript" },
  { repo: "Meal-Finder", name: "Meal Finder", function: "Meal search", language: "TypeScript" },
  { repo: "Data-Structure-and-Algorithms-implementation-", name: "DSA implementations", function: "Data structures and algorithms, by hand", language: "C++" },
  { repo: "Twitter-Complain-Bot", name: "Twitter Complain Bot", function: "Tweets at the ISP when speed drops below plan", language: "Python" },
  { repo: "pong-game", name: "Pong", function: "Pong with turtle graphics and bounce physics", language: "Python" },
  { repo: "Int-as-integer-data_type", name: "Int wrapper", function: "Operator-overloaded integer type", language: "C++" },
  { repo: "auto-clicker", name: "Auto-clicker", function: "Two-key autoclicker", language: "C++" },
];

export const STATUS_LABEL = {
  active: "Active",
  preview: "In development",
  complete: "Complete",
} as const satisfies Record<ProjectStatus, string>;
