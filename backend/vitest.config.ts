import { config } from "dotenv";
import { defineConfig } from "vitest/config";

// Load .env before test workers start so SUPABASE_URL etc. are present
// when app.ts / supabase.service.ts are first imported.
config();

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/tests/**/*.test.ts"],
    // Run tests sequentially to avoid port conflicts
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
  },
});
