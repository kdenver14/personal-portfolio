import type { Replay, WindowItem, WindowStep } from "@/domain/datasheet";
import { pomodoroClock } from "../lib/replay";

/*
 * Scripted replays for the More projects pop-ups. Each follows its repository's code: `out` lines are
 * only what the program really prints, in its own wording, with sample values. Anything that happens
 * off-screen (a browser, an email, a key press) is a `note`, drawn as a comment. No secrets, ever.
 */

const SECOND = 1000;
/** How long each sped-up Pomodoro readout stays on screen. */
const TICK_HOLD = 260;
const MINUTE = 60;

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

/** A sped-up countdown through the given readouts, in seconds. */
const countdown = (readouts: readonly number[]): WindowStep[] =>
  readouts.map((seconds) => ({ set: { display: pomodoroClock(seconds) }, hold: TICK_HOLD }));

const TODO_ACTIONS = ["Save", "Delete"];
const RECIPE_ACTIONS = ["Edit", "Delete"];
const ADOBO = { name: "Adobo", ingredients: "chicken, soy sauce, vinegar, garlic", steps: "Simmer everything for 40 minutes." };

export const REPLAYS: readonly Replay[] = [
  {
    id: "auto-reply",
    repo: "Automatic-bot-reply",
    kind: "terminal",
    title: "auto_reply.py",
    description:
      "The script starts listening to a Telegram group. When someone sends “Roll call!”, it waits 15 seconds and replies “Here” from the owner's own account.",
    steps: [
      { cmd: "python auto_reply.py" },
      { out: "==================================================" },
      { out: "🤖 Telegram Auto-Reply Script" },
      { out: "==================================================" },
      { out: "📍 Monitoring group: CS 2A" },
      { out: "🔍 Trigger words: ['rollcall', 'roll call']" },
      { out: "💬 Message to send: 'Here'" },
      { out: "⏱️  Cooldown: 60 seconds" },
      { out: "==================================================" },
      { out: "👂 Listening for messages... (Press Ctrl+C to stop)" },
      { wait: SECOND },
      { note: "a classmate posts “Roll call!” in the group" },
      { out: "[2026-01-12 08:00:03] 🎯 Trigger detected! 'roll call' from Ana" },
      { out: "[2026-01-12 08:00:03] ⏳ Waiting 15 seconds before sending..." },
      { wait: 1.5 * SECOND },
      { out: "[2026-01-12 08:00:18] ✅ Sent 'Here' to the group", tone: "ok" },
    ],
  },
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
    id: "todo-app",
    repo: "Todo-App",
    kind: "window",
    title: "Todo App",
    description:
      "Two todos are added through the form, the first is edited in place and saved, and the second is deleted. Each change is a server action writing through Prisma.",
    initial: {
      heading: "",
      fields: [{ placeholder: "Add a new todo...", value: "" }],
      action: "Add Todo",
      items: [],
    },
    steps: [
      { type: "Buy groceries" },
      { set: { fields: [{ placeholder: "Add a new todo...", value: "" }], items: [{ text: "Buy groceries", actions: TODO_ACTIONS }] } },
      { type: "Finish the CS report" },
      {
        set: {
          fields: [{ placeholder: "Add a new todo...", value: "" }],
          items: [
            { text: "Buy groceries", actions: TODO_ACTIONS },
            { text: "Finish the CS report", actions: TODO_ACTIONS },
          ],
        },
      },
      { append: " and milk", item: 0 },
      { set: { items: [{ text: "Buy groceries and milk", actions: TODO_ACTIONS }] }, hold: 2 * SECOND },
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
    id: "recipe-manager",
    repo: "recipe-manager",
    kind: "window",
    title: "Recipe Book",
    description:
      "A recipe is added with its name, comma-separated ingredients and instructions, then edited and updated. The list lives in a Zustand store.",
    initial: {
      heading: "Recipe Book",
      fields: [
        { placeholder: "Recipe Name", value: "" },
        { placeholder: "Ingredients (comma separated)", value: "" },
        { placeholder: "Instructions", value: "" },
      ],
      action: "Add Recipe",
      items: [],
    },
    steps: [
      { type: ADOBO.name, field: 0 },
      { type: ADOBO.ingredients, field: 1 },
      { type: ADOBO.steps, field: 2 },
      {
        set: {
          fields: [
            { placeholder: "Recipe Name", value: "" },
            { placeholder: "Ingredients (comma separated)", value: "" },
            { placeholder: "Instructions", value: "" },
          ],
          items: [{ text: ADOBO.name, meta: `Ingredients: ${ADOBO.ingredients}`, actions: RECIPE_ACTIONS }],
        },
      },
      {
        set: {
          fields: [
            { placeholder: "Recipe Name", value: ADOBO.name },
            { placeholder: "Ingredients (comma separated)", value: ADOBO.ingredients },
            { placeholder: "Instructions", value: ADOBO.steps },
          ],
          action: "Update Recipe",
        },
      },
      { append: ", bay leaf", field: 1 },
      {
        set: {
          fields: [
            { placeholder: "Recipe Name", value: "" },
            { placeholder: "Ingredients (comma separated)", value: "" },
            { placeholder: "Instructions", value: "" },
          ],
          action: "Add Recipe",
          items: [{ text: ADOBO.name, meta: `Ingredients: ${ADOBO.ingredients}, bay leaf`, actions: RECIPE_ACTIONS }],
        },
        hold: 2 * SECOND,
      },
    ],
  },
  {
    id: "game-store",
    repo: "Game-Store",
    kind: "terminal",
    title: "GameStore.Api",
    description:
      "The ASP.NET Core API starts, then the requests from its games.http file run: list the games, add Final Fantasy XIV, and delete a game. Each answer comes back as JSON or a status code.",
    steps: [
      { cmd: "dotnet run" },
      { out: "info: Microsoft.Hosting.Lifetime[14]" },
      { out: "      Now listening on: http://localhost:5212" },
      { cmd: "curl localhost:5212/games" },
      { note: "GET /games waits 3 s on purpose (Task.Delay), to show loading" },
      { wait: SECOND },
      { out: '[{"id":1,"name":"Street Fighter II Turbo","genre":"Fighting","price":19.99,"releaseDate":"1991-02-01"},' },
      { out: ' {"id":2,"name":"FIFA 23","genre":"Sports","price":69.99,"releaseDate":"2022-09-27"}]' },
      { cmd: "curl -i -X POST localhost:5212/games -H 'Content-Type: application/json' -d '{\"name\":\"Final Fantasy XIV\",\"genreId\":2,\"price\":59.99,\"releaseDate\":\"2010-09-30\"}'" },
      { out: "HTTP/1.1 201 Created", tone: "ok" },
      { out: "Location: http://localhost:5212/games/3" },
      { out: '{"id":3,"name":"Final Fantasy XIV","genreId":2,"price":59.99,"releaseDate":"2010-09-30"}' },
      { cmd: "curl -i -X DELETE localhost:5212/games/2" },
      { out: "HTTP/1.1 204 No Content", tone: "ok" },
    ],
  },
  {
    id: "dsa",
    repo: "Data-Structure-and-Algorithms-implementation-",
    kind: "terminal",
    title: "Sorting",
    description:
      "Three of the hand-written sorts are compiled and run on the arrays in their own main functions, and each prints its array in order.",
    steps: [
      { note: "bubbleSort.cpp sorts {6,4,2,5,1,3}" },
      { cmd: "g++ bubbleSort.cpp -o bubble && ./bubble" },
      { out: "1 2 3 4 5 6" },
      { note: "selectionSort.cpp, same array" },
      { cmd: "g++ selectionSort.cpp -o selection && ./selection" },
      { out: "1 2 3 4 5 6" },
      { note: "mergeSort.cpp sorts {3,1,4,2}" },
      { cmd: "g++ mergeSort.cpp -o merge && ./merge" },
      { out: "1 2 3 4" },
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
    id: "checking-stock",
    repo: "Checking-Stock",
    kind: "terminal",
    title: "main.py",
    description:
      "The script prints Tesla's last two closing prices from Alpha Vantage, their difference and the percentage move. Because the move is over 1%, it fetches three news articles and emails them to the owner.",
    steps: [
      { cmd: "python main.py" },
      { out: "248.5000" },
      { out: "236.1200" },
      { out: "12.379999999999995" },
      { out: "4.98189134808853" },
      { note: "moved more than 1%, so it pulls Tesla news from NewsAPI" },
      { out: "[{'source': {...}, 'title': '...', 'description': '...'}, ...]" },
      { note: "emails the three headlines to the owner over SMTP" },
    ],
  },
  {
    id: "iss-tracker",
    repo: "ISS-Tracker",
    kind: "terminal",
    title: "improved.py",
    description:
      "The script runs quietly, checking once a minute. When the ISS is within 5° of home and it is dark, it sends an email saying “Look Up, the ISS is above you in the sky.”",
    steps: [
      { cmd: "python improved.py" },
      { note: "prints nothing; every 60 s it checks two APIs" },
      { note: "19:41  ISS at 48.2°N 12.5°E, not overhead" },
      { note: "19:42  ISS at 45.9°N 16.8°E, not overhead" },
      { wait: SECOND },
      { note: "20:13  ISS within 5° of home, and the sun has set" },
      { note: "emails “Look Up👆 The ISS is above you in the sky.”" },
    ],
  },
  {
    id: "pomodoro",
    repo: "pomodoro-app",
    kind: "window",
    title: "Pomodoro",
    description:
      "The Tkinter timer, sped up: Start runs a 25-minute work session, then a 5-minute break that adds a check mark, then the next work session begins.",
    initial: { heading: "Timer", display: "00:00", action: "Start", marks: "" },
    steps: [
      { wait: 0.6 * SECOND },
      { set: { heading: "Work", display: pomodoroClock(25 * MINUTE) } },
      ...countdown([20, 15, 10, 5, 2, 1].map((minutes) => minutes * MINUTE)),
      ...countdown([3, 2, 1, 0]),
      { set: { heading: "Break", display: pomodoroClock(5 * MINUTE), marks: "✔" } },
      ...countdown([4, 3, 2, 1].map((minutes) => minutes * MINUTE)),
      ...countdown([3, 2, 1, 0]),
      { set: { heading: "Work", display: pomodoroClock(25 * MINUTE) }, hold: 2 * SECOND },
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

/** The replay for a repository, if it has one. */
export function replayFor(repo: string): Replay | undefined {
  return REPLAYS.find((replay) => replay.repo === repo);
}
