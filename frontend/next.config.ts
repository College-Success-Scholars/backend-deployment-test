import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow webpack builds to access files above the Next.js project root.
  experimental: {
    externalDir: true,
  },

  // Turbopack workspace root (Next.js 15.3+).
  // Sets the root one level above frontend/ so Turbopack can resolve
  // ../../../shared/dist/ imports from lib/format/time.ts and lib/types/time.ts.
  turbopack: {
    root: "..",
  },
};

export default nextConfig;
