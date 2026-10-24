import type { TechLogo } from "@/domain/datasheet";
import { logoNamed } from "./logos";

/** The scrolling strip under the intro: a short accent of the main technologies. The Stack section has the full list. */
export const TECH: readonly TechLogo[] = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Tailwind CSS",
  "Python",
  "Keras",
  "MediaPipe",
  "OpenCV",
  "C++",
  "C#",
  ".NET",
  "Git",
].map(logoNamed);
