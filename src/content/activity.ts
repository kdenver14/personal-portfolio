import data from "@/data/contributions.json";
import { longestStreak, parseContributions } from "@/lib/contributions";

/** The public GitHub contribution calendar, refreshed at each Vercel build by scripts/fetch-contributions.mjs. */
export const CONTRIBUTIONS = parseContributions(data);
export const LONGEST_STREAK = longestStreak(CONTRIBUTIONS.days);
