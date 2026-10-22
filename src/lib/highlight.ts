import type { CodeLanguage } from "@/domain/datasheet";

const COMMENT_MARKER: Record<CodeLanguage, string> = {
  typescript: "//",
  python: "#",
  cpp: "//",
};

const QUOTES = new Set(["'", '"']);

export interface SplitLine {
  code: string;
  comment: string;
}

/** Splits a source line into code and trailing comment, ignoring markers inside string literals. */
export function splitComment(line: string, language: CodeLanguage): SplitLine {
  const marker = COMMENT_MARKER[language];
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const char = line[i] ?? "";
    if (quote) {
      if (char === "\\") i++;
      else if (char === quote) quote = null;
    } else if (QUOTES.has(char)) {
      quote = char;
    } else if (line.startsWith(marker, i)) {
      return { code: line.slice(0, i), comment: line.slice(i) };
    }
  }
  return { code: line, comment: "" };
}
