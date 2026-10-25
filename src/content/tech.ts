import type { TechLogo } from "@/domain/datasheet";
import { logoNamed } from "./logos";

/** The scrolling strip that opens the Technologies section: a short accent of the main technologies. The list below it has them all. */
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
