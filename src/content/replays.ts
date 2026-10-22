import type { Replay, WindowItem } from "@/domain/datasheet";

/*
 * Scripted replays for the More projects pop-ups. Each follows its repository's code: `out` lines are
 * only what the program really prints, in its own wording, with sample values. Anything that happens
 * off-screen (a browser, an email, a key press) is a `note`, drawn as a comment. No secrets, ever.
 */

const SECOND = 1000;

const meals = (names: readonly string[]): WindowItem[] => names.map((text) => ({ text }));

/** Real names from TheMealDB's Seafood category, which Meal-Finder fetches. */
const SEAFOOD = [
  "Acaraje black-eyed pea fritters with shrimp filling",
  "Amok Trey – Cambodian Fish Curry",
  "Arroz con gambas y calamar",
  "Bahia-style Moqueca prawn stew",
];
const SALMON = [
  "Baked salmon with fennel & tomatoes",
  "Honey Teriyaki Salmon",
  "Salmon Avocado Salad",
  "Salmon noodle soup",
];

export const REPLAYS: readonly Replay[] = [
  {
    id: "collection-manager",
    repo: "Collection-Manager",
    kind: "window",
    title: "Collection Manager",
    description:
      "The Games page lists two games. The Add New Game form is filled in with a name, genre and release date, and the list comes back with three.",
    initial: {
      heading: "Games",
      status: "2 games in your collection",
      action: "Add Game",
      items: [
        { text: "Elden Ring", meta: "Action RPG" },
        { text: "Stardew Valley", meta: "Simulation" },
      ],
    },
    steps: [
      { wait: SECOND },
      {
        set: {
          heading: "Add New Game",
          status: "",
          items: [],
          action: "Add Game",
          fields: [
            { label: "Name", placeholder: "Enter game name", value: "" },
            { label: "Image URL", placeholder: "https://example.com/image.jpg", value: "" },
            { label: "Genre", placeholder: "e.g., Action, RPG, Strategy", value: "" },
            { label: "Release Date", value: "" },
          ],
        },
      },
      { type: "Hollow Knight", field: 0 },
      { type: "https://…/hollow-knight.jpg", field: 1 },
      { type: "Metroidvania", field: 2 },
      { type: "2017-02-24", field: 3 },
      {
        set: {
          heading: "Games",
          status: "3 games in your collection",
          fields: [],
          items: [
            { text: "Elden Ring", meta: "Action RPG" },
            { text: "Stardew Valley", meta: "Simulation" },
            { text: "Hollow Knight", meta: "Metroidvania" },
          ],
        },
        hold: 2 * SECOND,
      },
    ],
  },
  {
    id: "meal-finder",
    repo: "Meal-Finder",
    kind: "window",
    title: "Meal Finder",
    description:
      "The page loads TheMealDB's seafood recipes. Typing “salmon” in the search box narrows the list to the salmon dishes as you type.",
    initial: {
      heading: "Seafood Recipes",
      fields: [{ placeholder: "Search for a meal...", value: "" }],
      items: meals(SEAFOOD),
    },
    steps: [
      { wait: SECOND },
      { type: "salmon" },
      { set: { items: meals(SALMON) }, hold: 2.5 * SECOND },
    ],
  },
  {
    id: "twitter-complain-bot",
    repo: "Twitter-Complain-Bot",
    kind: "terminal",
    title: "main.py",
    description:
      "Selenium runs a speed test on speedtest.net, then logs in to X and posts a complaint to the internet provider quoting the measured speed against the promised 1500 down / 90 up.",
    steps: [
      { cmd: "python main.py" },
      { note: "Chrome opens speedtest.net and presses Go" },
      { out: "Hold on! Just 1 min" },
      { out: "Bot on duty..Fetching Results!!!" },
      { wait: 1.5 * SECOND },
      { out: "Successfully Fetched Internet Speed", tone: "ok" },
      { note: "logs in to x.com and posts:" },
      { note: "“Hey Internet Provider, why is my internet speed 312.4down/48.7up when I pay for 1500down/90up?”" },
    ],
  },
  {
    id: "express-full",
    repo: "Express-Full",
    kind: "terminal",
    title: "localhost:5001",
    description:
      "With the API running and movies seeded, a new user registers and gets a JWT. Adding a movie to the watchlist without the token is refused by the auth middleware; with the token, it is added.",
    steps: [
      { note: "npm run dev is serving on port 5001, with movies seeded" },
      { cmd: `curl --json '{"name":"Kurt","email":"kurt@example.com","password":"Watchlist1"}' localhost:5001/auth/register` },
      { out: '{"status":"success","data":{"user":{…}},"token":"eyJhbGciOi…"}', tone: "ok" },
      { note: "the token goes in $TOKEN" },
      { cmd: `curl --json '{"movieId":"9b2f…","rating":9}' localhost:5001/watchlist` },
      { out: '{"error":"Not authorized, no token provided"}' },
      { cmd: `curl --json '{"movieId":"9b2f…","rating":9}' -H "Authorization: Bearer $TOKEN" localhost:5001/watchlist` },
      { out: '{"status":"Success","data":{"userId":"…","movieId":"9b2f…","rating":9}}', tone: "ok" },
    ],
  },
  {
    id: "pong",
    repo: "pong-game",
    kind: "pong",
    title: "Pong",
    description:
      "The turtle-graphics game, sped up three times: the ball bounces off the walls, each paddle hit makes it faster, and a miss scores a point for the other side.",
    seconds: 16,
    speed: 3,
  },
  {
    id: "auto-clicker",
    repo: "auto-clicker",
    kind: "terminal",
    title: "main.cpp",
    description:
      "The Windows console program prints its controls. Pressing X starts sending left clicks as fast as the loop allows, and Z stops them.",
    steps: [
      { cmd: "autoclicker.exe" },
      { out: "Press 'X' to enable and 'Z' to disable autoclicker" },
      { wait: SECOND },
      { note: "X pressed: left click, release, Sleep(1), repeat" },
      { wait: 1.5 * SECOND },
      { note: "Z pressed: clicking stops" },
    ],
  },
];

/** The replay for a More project; every one has a replay, so a missing one fails the build. */
export function replayFor(repo: string, replays: readonly Replay[] = REPLAYS): Replay {
  const replay = replays.find((r) => r.repo === repo);
  if (!replay) {
    throw new Error(`No replay for repository "${repo}"`);
  }
  return replay;
}
