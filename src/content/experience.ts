import type { Role } from "@/domain/datasheet";

/** From the owner's LinkedIn, newest first. LinkedIn lists the LOOP Marketers work twice with one description; it is shown once. */
export const EXPERIENCE: readonly Role[] = [
  {
    title: "Software Developer (Automation Project)",
    company: "LOOP Marketers",
    terms: ["Freelance", "Remote"],
    start: "2026-01",
    end: "2026-02",
    summary:
      "Built a Telegram automation script using the Telegram MTProto API and Telethon that listens for specific keywords in group chats and responds in real time.",
    skills: ["Python", "Telethon", "Scripting"],
  },
  {
    title: "Open Source Contributor",
    company: "react-hook-form",
    terms: ["Remote"],
    start: "2025-12",
    end: "2025-12",
    summary:
      "Proposed a useFormDebug hook, with tests, to improve developer visibility into React Hook Form state during development.",
    skills: ["React", "Debugging", "Performance testing"],
    link: { label: "Pull request #13262", href: "https://github.com/react-hook-form/react-hook-form/pull/13262" },
  },
  {
    title: "Freelance Developer, Build & Dependency Fixes",
    company: "Freelance",
    terms: ["Antipolo City, Philippines", "Remote"],
    start: "2024-01",
    end: "2024-03",
    summary:
      "Fixed dependency conflicts in a TypeScript project, resolved build and tooling issues, and troubleshot Xcode configuration and environment problems.",
    skills: ["TypeScript", "Build tooling", "Debugging", "Xcode"],
  },
];
