#!/usr/bin/env node
/**
 * Rewrite markdown links under docs/ so GitHub Pages (MkDocs) navigation stays
 * inside the docs tree. Code / CI targets become GitHub blob URLs.
 *
 * Idempotent: already-absolute GitHub blob URLs are left alone.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const REPO = "College-Success-Scholars/css-atlas-v2";
const BRANCH = process.env.DOCS_SOURCE_BRANCH || "develop";
const BLOB = `https://github.com/${REPO}/blob/${BRANCH}`;

const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;

function walkMarkdown(dir, out = []) {
  for (const entr of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entr.name);
    if (entr.isDirectory()) {
      if (entr.name === "logs" || entr.name === "alerts") {
        // Skip agent logs/alerts (not published).
        if (full.includes(`${path.sep}agents${path.sep}`)) continue;
      }
      if (entr.name === "reference" && path.basename(path.dirname(full)) === "docs") {
        // Generated API pages — leave alone.
        continue;
      }
      walkMarkdown(full, out);
    } else if (entr.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

function resolveLink(fromFile, href) {
  if (!href || href.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null; // absolute URL / mailto
  const [pathPart, hash = ""] = href.split("#");
  if (!pathPart) return null;
  const abs = path.resolve(path.dirname(fromFile), pathPart);
  return { abs, hash: hash ? `#${hash}` : "", pathPart };
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function rewriteFile(file) {
  const original = fs.readFileSync(file, "utf8");
  let changed = false;
  const next = original.replace(LINK_RE, (full, text, href) => {
    const trimmed = href.trim();
    if (trimmed.startsWith(BLOB)) return full;

    const resolved = resolveLink(file, trimmed);
    if (!resolved) return full;

    const { abs, hash } = resolved;
    const relToRoot = toPosix(path.relative(ROOT, abs));

    // Inside docs/ → normalize to a relative path that never leaves docs/.
    if (abs === DOCS || abs.startsWith(DOCS + path.sep)) {
      const targetRel = toPosix(path.relative(path.dirname(file), abs));
      const normalized = (targetRel.startsWith(".") ? targetRel : `./${targetRel}`) + hash;
      if (normalized === trimmed || normalized === `./${trimmed}`) return full;
      // Only rewrite when the old link escaped docs and re-entered, or used an odd root path.
      const escapesDocs =
        !path.resolve(path.dirname(file), trimmed.split("#")[0]).startsWith(DOCS) ||
        trimmed.includes("/docs/agents/") ||
        trimmed.startsWith("../../../docs/");
      if (!escapesDocs && path.normalize(trimmed.split("#")[0]) === path.normalize(targetRel)) {
        return full;
      }
      changed = true;
      return `[${text}](${normalized})`;
    }

    // Outside docs/ → GitHub blob (source / CI / package roots).
    const repoRoots = ["frontend", "backend", "shared", "scripts", ".github"];
    const inRepoRoot = repoRoots.some(
      (root) => relToRoot === root || relToRoot.startsWith(`${root}/`),
    );
    if (inRepoRoot) {
      // Directories linked with a trailing slash still need a usable blob URL.
      const blobPath = relToRoot.endsWith("/")
        ? relToRoot.replace(/\/$/, "")
        : relToRoot;
      changed = true;
      return `[${text}](${BLOB}/${blobPath}${hash})`;
    }

    return full;
  });

  if (changed && next !== original) {
    fs.writeFileSync(file, next);
    return true;
  }
  return false;
}

const files = walkMarkdown(DOCS);
let n = 0;
for (const f of files) {
  if (rewriteFile(f)) {
    n++;
    console.log("rewrote", toPosix(path.relative(ROOT, f)));
  }
}
console.log(`docs-rewrite-links: updated ${n} / ${files.length} files`);
