#!/usr/bin/env node
/**
 * Fail if allowlisted frontend paths contain theme-unsafe color/transition patterns.
 * Keep patterns aligned with frontend/lib/theme/theme-safety.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_ROOTS = [
  "frontend/app/traffic",
  "frontend/components/mentee-monitoring",
  "frontend/components/charts",
  "frontend/components/personal",
  "frontend/lib/dashboard",
];

/** Mirrors frontend/lib/theme/theme-safety.ts THEME_UNSAFE_PATTERNS */
const FORBIDDEN = [
  { name: "bg-white", re: /\bbg-white\b/ },
  { name: "bg-green-*", re: /\bbg-green-/ },
  { name: "text-green-*", re: /\btext-green-/ },
  { name: "border-green-*", re: /\bborder-green-/ },
  { name: "bg-red-50", re: /\bbg-red-50\b/ },
  { name: "transition-all", re: /\btransition-all\b/ },
  { name: "hex color", re: /#[0-9a-fA-F]{3,8}\b/ },
];

/** Soft chip: bg-*-muted + text-*-foreground (not muted-foreground) */
const MUTED_FOREGROUND_LINE =
  /\bbg-(success|warning|info)-muted\b.*\btext-(success|warning|info)-foreground\b|\btext-(success|warning|info)-foreground\b.*\bbg-(success|warning|info)-muted\b/;

function collectFiles(target, out = []) {
  const abs = path.join(ROOT, target);
  if (!fs.existsSync(abs)) return out;
  const st = fs.statSync(abs);
  if (st.isFile()) {
    if (/\.(ts|tsx)$/.test(abs) && !/\.(test|spec)\.(ts|tsx)$/.test(abs)) {
      out.push(abs);
    }
    return out;
  }
  for (const entr of fs.readdirSync(abs, { withFileTypes: true })) {
    const full = path.join(abs, entr.name);
    if (entr.isDirectory()) {
      collectFiles(path.relative(ROOT, full), out);
    } else if (
      /\.(ts|tsx)$/.test(entr.name) &&
      !/\.(test|spec)\.(ts|tsx)$/.test(entr.name)
    ) {
      out.push(full);
    }
  }
  return out;
}

const violations = [];

for (const root of SCAN_ROOTS) {
  for (const file of collectFiles(root)) {
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split("\n");
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("*") ||
        trimmed.startsWith("/*")
      ) {
        return;
      }
      for (const rule of FORBIDDEN) {
        if (rule.re.test(line)) {
          violations.push({
            file: path.relative(ROOT, file),
            line: idx + 1,
            rule: rule.name,
            text: trimmed.slice(0, 120),
          });
        }
      }
      if (MUTED_FOREGROUND_LINE.test(line)) {
        violations.push({
          file: path.relative(ROOT, file),
          line: idx + 1,
          rule: "muted+*-foreground",
          text: trimmed.slice(0, 120),
        });
      }
    });
  }
}

if (violations.length > 0) {
  console.error("check-theme-safety: theme-unsafe patterns found:\n");
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} [${v.rule}] ${v.text}`);
  }
  console.error(
    `\n${violations.length} violation(s). Use semantic CSS tokens from app/globals.css; soft chips use text-*-muted-foreground (not text-*-foreground) on bg-*-muted.`
  );
  process.exit(1);
}

console.log(
  `check-theme-safety: ok (${SCAN_ROOTS.join(", ")}; ${FORBIDDEN.length + 1} rules)`
);
