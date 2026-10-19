import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Unused code is enforced here, not with tsc's noUnusedLocals/noUnusedParameters:
    // tsc also checks Next's generated .next/dev/types/validator.ts, which ships unused imports.
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cloned project repos kept beside the site for screen recording.
    "all-projects-repo-for-vid-rec/**",
  ]),
]);

export default eslintConfig;
