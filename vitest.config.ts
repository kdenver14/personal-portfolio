import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Cloned project repos kept beside the site for screen recording carry their own tests.
    exclude: [...configDefaults.exclude, "all-projects-repo-for-vid-rec/**"],
  },
});
