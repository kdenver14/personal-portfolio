import { FEATURED } from "./featured";
import { GITHUB_URL } from "./profile";
import { projectByRepo } from "./projects";
import { REPLAYS } from "./replays";

export interface LanguageShare {
  name: string;
  /** Percent of code across the public repos, from GitHub's per-repo language bytes. */
  share: number;
  use: string;
  /** Repositories that prove it, best first. */
  repos: readonly string[];
}

/** Largest share first. Shares as of October 2026, across SHARE_REPO_COUNT public repos, not counting this site. */
export const LANGUAGE_SHARES: readonly LanguageShare[] = [
  {
    name: "TypeScript",
    share: 35,
    use: "Daily. Next.js, Express 5, Prisma.",
    repos: ["uptime-monitor", "Express-Full", "Collection-Manager", "Meal-Finder"],
  },
  {
    name: "Python",
    share: 21,
    use: "MediaPipe, Keras, Selenium.",
    repos: ["Hand-Gesture-Control-Keras-Project", "Twitter-Complain-Bot", "pong-game"],
  },
  {
    name: "C++",
    share: 21,
    use: "First language. Memory and operators.",
    repos: ["Int-as-integer-data_type", "Data-Structure-and-Algorithms-implementation-", "auto-clicker"],
  },
  { name: "C#", share: 8, use: "ASP.NET Core, EF Core.", repos: ["Game-Store"] },
];

/** HTML, CSS and JavaScript together: the front ends of the projects above. */
export const WEB_SHARE = 14;
export const SHARE_REPO_COUNT = 18;

export const OPEN_SOURCE = {
  label: "react-hook-form PR #13262",
  href: "https://github.com/react-hook-form/react-hook-form/pull/13262",
} as const;

/** Repos the glance names that have no row on this page, so they link to GitHub. */
const OFF_PAGE_NAMES: Readonly<Record<string, string>> = { "Game-Store": "Game Store" };

export interface Proof {
  name: string;
  href: string;
  external: boolean;
}

/** A project that proves a language: its pop-up on this page when it has one, otherwise its GitHub repo. */
export function proofFor(repo: string): Proof {
  const dialog = [...FEATURED, ...REPLAYS].find((entry) => entry.repo === repo);
  if (dialog) {
    return { name: projectByRepo(repo).name, href: `#${dialog.id}`, external: false };
  }
  const name = OFF_PAGE_NAMES[repo];
  if (!name) {
    throw new Error(`"${repo}" has no pop-up on this page and no off-page name`);
  }
  return { name, href: `${GITHUB_URL}/${repo}`, external: true };
}
