import "dotenv/config";

// Fail fast: crash at startup if required env vars are missing so Railway/Vercel
// marks the deploy unhealthy rather than serving broken responses.
const REQUIRED_ENV = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"] as const;
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

import { app } from "./app.js";

const PORT = process.env.PORT ?? 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown — lets Railway/Vercel drain in-flight requests cleanly
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
