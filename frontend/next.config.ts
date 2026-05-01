import type { NextConfig } from "next";
import { resolve } from "node:path";

const monorepoRoot = resolve(__dirname, "..");

const nextConfig: NextConfig = {
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
};

export default nextConfig;
