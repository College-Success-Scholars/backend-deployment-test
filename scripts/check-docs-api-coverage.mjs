#!/usr/bin/env node
/**
 * Fail if TypeDoc markdown is missing function pages for entry-point packages.
 * Heuristic: every *.ts / *.tsx file under covered roots with `export function`
 * or `export async function` or `export const X =` should have a matching .md
 * under docs/reference/api (best-effort; skips re-export barrels lightly).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_ROOT = path.join(ROOT, "docs", "reference", "api");

const ROOTS = [
  "shared",
  "backend/src/controllers",
  "backend/src/services",
  "backend/src/middleware",
  "frontend/lib",
  "frontend/components/personal/utils.ts",
  "frontend/components/mentee-monitoring/utils.ts",
];

const EXPORT_RE =
  /^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)|^export\s+const\s+([A-Za-z0-9_]+)\s*=/gm;

function collectFiles(target, out = []) {
  const abs = path.join(ROOT, target);
  if (!fs.existsSync(abs)) return out;
  const st = fs.statSync(abs);
  if (st.isFile()) {
    out.push(abs);
    return out;
  }
  for (const entr of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entr.name);
    if (entr.isDirectory()) {
      if (entr.name === "node_modules" || entr.name === "tests") continue;
      collectFiles(path.relative(ROOT, full), out);
    } else if (/\.(ts|tsx)$/.test(entr.name) && !/\.(test|spec)\.(ts|tsx)$/.test(entr.name)) {
      out.push(full);
    }
  }
  return out;
}

function listGeneratedNames() {
  const names = new Set();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entr of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entr.name);
      if (entr.isDirectory()) walk(full);
      else if (
        entr.name.endsWith(".md") &&
        (full.includes(`${path.sep}functions${path.sep}`) ||
          full.includes(`${path.sep}variables${path.sep}`))
      ) {
        names.add(entr.name.replace(/\.md$/, ""));
      }
    }
  }
  walk(API_ROOT);
  return names;
}

if (!fs.existsSync(API_ROOT)) {
  console.error("check-docs-api-coverage: run npm run docs:typedoc first");
  process.exit(1);
}

const generated = listGeneratedNames();
const missing = [];
for (const root of ROOTS) {
  for (const file of collectFiles(root)) {
    const src = fs.readFileSync(file, "utf8");
    let m;
    EXPORT_RE.lastIndex = 0;
    while ((m = EXPORT_RE.exec(src))) {
      const name = m[1] || m[2];
      if (!name || name === "default") continue;
      if (!generated.has(name)) {
        missing.push(`${path.relative(ROOT, file)}:${name}`);
      }
    }
  }
}

if (missing.length) {
  console.error(`Missing TypeDoc pages for ${missing.length} export(s):`);
  for (const row of missing.slice(0, 50)) console.error(" -", row);
  if (missing.length > 50) console.error(` ...and ${missing.length - 50} more`);
  process.exit(1);
}

console.log(`check-docs-api-coverage: OK (${generated.size} generated function/variable pages)`);
