export interface StackItem {
  name: string;
  /** What I use it for, in one short line. */
  note: string;
}

export interface StackGroup {
  name: string;
  items: readonly StackItem[];
}

const tech = (name: string, note: string): StackItem => ({ name, note });

/** Every technology in the public repos, grouped for the Stack section, from languages through to tooling. */
export const STACK: readonly StackGroup[] = [
  {
    name: "Languages",
    items: [
      tech("TypeScript", "Most of what I write, front to back."),
      tech("JavaScript", "Plain scripts, and what TypeScript compiles to."),
      tech("Python", "Machine learning, automation and bots."),
      tech("C++", "Data structures, memory and operators."),
      tech("C#", "Web APIs on ASP.NET Core."),
    ],
  },
  {
    name: "Frontend",
    items: [
      tech("React", "Component UIs with hooks."),
      tech("Next.js", "Full-stack apps, and this site."),
      tech("Vite", "Single-page React apps."),
      tech("Tailwind CSS", "Styling on most of my front ends."),
      tech("Radix UI", "Accessible dialogs and form labels."),
      tech("React Hook Form", "Forms; proposed a debugging hook upstream."),
      tech("Zustand", "Small client-side state stores."),
      tech("HTML", "Semantic, accessible markup."),
      tech("CSS", "Hand-written layouts, like this site's."),
    ],
  },
  {
    name: "Backend",
    items: [
      tech("Node.js", "Runtime for my TypeScript back ends."),
      tech("Express", "REST APIs on Express 5."),
      tech("ASP.NET Core", "Minimal APIs in C#."),
      tech("Zod", "Validating input at the boundary."),
      tech("JWT", "Stateless auth with hashed passwords."),
    ],
  },
  {
    name: "Data",
    items: [
      tech("PostgreSQL", "Main database, run in Docker."),
      tech("SQLite", "Local apps, through Prisma."),
      tech("Prisma", "Schemas, migrations and typed queries."),
      tech("EF Core", "Data access for ASP.NET Core."),
    ],
  },
  {
    name: "ML and automation",
    items: [
      tech("Keras", "Training a gesture classifier."),
      tech("MediaPipe", "Hand landmarks from a webcam."),
      tech("OpenCV", "Webcam capture and frames."),
      tech("NumPy", "Landmark arrays for training."),
      tech("Selenium", "Browser automation for a bot."),
      tech("Telethon", "Telegram automation, for a client."),
    ],
  },
  {
    name: "Tools",
    items: [
      tech("Git", "Version control on everything."),
      tech("GitHub", "Hosting, pull requests, open source."),
      tech("Docker", "Local Postgres with Compose."),
      tech("Vitest", "Unit tests, including this site's."),
      tech("ESLint", "Linting on strict settings."),
      tech("npm", "Packages and scripts."),
      tech("Vercel", "Hosting and deploys for this site."),
    ],
  },
];
