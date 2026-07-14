#!/usr/bin/env node
/**
 * Mirror backend/API.md into the published docs tree (additive for MkDocs).
 * Canonical REST docs remain backend/API.md; this file is regenerated for Pages.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(ROOT, "backend", "API.md");
const dest = path.join(ROOT, "docs", "dev", "backend", "api.md");

const body = fs.readFileSync(src, "utf8");
const banner = `---
title: REST API
---

> **Canonical source:** [\`backend/API.md\`](https://github.com/College-Success-Scholars/css-atlas-v2/blob/develop/backend/API.md) in the repository. This page is a mirror for GitHub Pages navigation.

`;

fs.mkdirSync(path.dirname(dest), { recursive: true });
// Strip a leading H1 if present so MkDocs title/nav stay clean; keep body.
const stripped = body.replace(/^#\s+[^\n]+\n+/, "");
fs.writeFileSync(dest, banner + "# REST API\n\n" + stripped);
console.log("docs-copy-api-md: wrote", path.relative(ROOT, dest));
