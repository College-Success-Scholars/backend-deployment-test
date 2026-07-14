#!/usr/bin/env node
/**
 * Append (or refresh) ## API Reference sections on handbook READMEs.
 * Indexes are built from TypeDoc markdown under docs/reference/api/.
 * Idempotent via AUTO-API-REFERENCE markers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_ROOT = path.join(ROOT, "docs", "reference", "api");
const START = "<!-- AUTO-API-REFERENCE:START -->";
const END = "<!-- AUTO-API-REFERENCE:END -->";

/** Handbook README → TypeDoc path under docs/reference/api, or a custom builder. */
const MAP = [
  { readme: "docs/dev/shared/src/README.md", apiRel: "shared" },
  { readme: "docs/dev/shared/README.md", apiRel: "shared" },
  { readme: "docs/dev/backend/src/controllers/README.md", apiRel: "backend/src/controllers" },
  { readme: "docs/dev/backend/src/services/README.md", apiRel: "backend/src/services" },
  { readme: "docs/dev/backend/src/middleware/README.md", apiRel: "backend/src/middleware" },
  { readme: "docs/dev/backend/src/models/README.md", apiRel: "backend/src/models" },
  // Routes only export default Express routers — TypeDoc pages are empty; use REST + controllers.
  { readme: "docs/dev/backend/src/routes/README.md", custom: "routes" },
  { readme: "docs/dev/frontend/lib/README.md", apiRel: "frontend/lib" },
  { readme: "docs/dev/frontend/lib/server/README.md", apiRel: "frontend/lib/server" },
  { readme: "docs/dev/frontend/lib/client/README.md", apiRel: "frontend/lib/client" },
  { readme: "docs/dev/frontend/lib/auth/README.md", apiRel: "frontend/lib/auth" },
  { readme: "docs/dev/frontend/lib/format/README.md", apiRel: "frontend/lib/format" },
  { readme: "docs/dev/frontend/lib/supabase/README.md", apiRel: "frontend/lib/supabase" },
  { readme: "docs/dev/frontend/lib/types/README.md", apiRel: "frontend/lib/types" },
  { readme: "docs/dev/frontend/lib/dev/README.md", apiRel: "frontend/lib/dev" },
  { readme: "docs/dev/frontend/lib/dashboard/README.md", apiRel: "frontend/lib/dashboard" },
  {
    readme: "docs/dev/frontend/components/personal/README.md",
    apiRel: "frontend/components/personal/utils",
  },
  {
    readme: "docs/dev/frontend/components/mentee-monitoring/README.md",
    apiRel: "frontend/components/mentee-monitoring/utils",
  },
];

const KIND_DIRS = ["functions", "variables", "classes", "interfaces", "type-aliases", "enumerations"];

function walkSymbolPages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entr of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entr.name);
    if (entr.isDirectory()) {
      if (KIND_DIRS.includes(entr.name)) {
        for (const f of fs.readdirSync(full)) {
          if (f.endsWith(".md")) {
            out.push({
              kind: entr.name,
              name: f.replace(/\.md$/, ""),
              file: path.join(full, f),
            });
          }
        }
      } else {
        walkSymbolPages(full, out);
      }
    }
  }
  return out;
}

function relLink(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).split(path.sep).join("/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

function moduleIsDefaultOnly(moduleDir) {
  const symbols = walkSymbolPages(moduleDir);
  return symbols.length > 0 && symbols.every((s) => s.name === "default");
}

function buildRoutesSection(readmeAbs) {
  const restApi = relLink(readmeAbs, path.join(ROOT, "docs/dev/backend/api.md"));
  const controllers = relLink(
    readmeAbs,
    path.join(ROOT, "docs/dev/backend/src/controllers/README.md"),
  );
  const controllersApi = path.join(ROOT, "docs/reference/api/backend/src/controllers");

  let md =
    `${START}\n\n## API Reference\n\n` +
    `Route files are thin Express wiring (\`export default router\`). ` +
    `They do not have useful TypeDoc pages. Use:\n\n` +
    `- **HTTP contracts** (paths, auth, params, responses): [REST API](${restApi})\n` +
    `- **Request handlers** (functions with parameters/returns): [Controllers handbook](${controllers})\n\n`;

  if (fs.existsSync(controllersApi)) {
    const children = fs
      .readdirSync(controllersApi, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    md += `| Controller | Handler docs |\n|------------|-------------|\n`;
    for (const child of children) {
      const childReadme = path.join(controllersApi, child, "README.md");
      if (!fs.existsSync(childReadme)) continue;
      md += `| \`${child}\` | [API](${relLink(readmeAbs, childReadme)}) |\n`;
    }
    md += `\n`;
  }

  md += `${END}\n`;
  return md;
}

function buildSection(readmeAbs, apiDirAbs) {
  const symbols = walkSymbolPages(apiDirAbs)
    .filter((s) => s.name !== "default")
    .sort((a, b) => a.name.localeCompare(b.name));
  if (symbols.length === 0) {
    return (
      `${START}\n\n## API Reference\n\n` +
      `No generated callable exports for this folder. See the [API Reference hub](${relLink(readmeAbs, path.join(ROOT, "docs/reference/README.md"))}).\n\n` +
      `${END}\n`
    );
  }

  const byKind = new Map();
  for (const s of symbols) {
    if (!byKind.has(s.kind)) byKind.set(s.kind, []);
    byKind.get(s.kind).push(s);
  }

  const kindTitle = {
    functions: "Functions",
    variables: "Variables / constants",
    classes: "Classes",
    interfaces: "Interfaces",
    "type-aliases": "Type aliases",
    enumerations: "Enumerations",
  };

  const hubLink = relLink(readmeAbs, path.join(ROOT, "docs/reference/README.md"));
  const folderReadme = path.join(apiDirAbs, "README.md");
  const hasFolderReadme = fs.existsSync(folderReadme);

  let md =
    `${START}\n\n## API Reference\n\n` +
    `Generated from TypeScript signatures (parameters and returns on each symbol page). ` +
    (hasFolderReadme
      ? `Module index: [browse folder](${relLink(readmeAbs, folderReadme)}).`
      : `See also the [API Reference hub](${hubLink}).`) +
    `\n\n`;

  // Prefer linking module README if present at leaf; otherwise list child modules.
  if (!hasFolderReadme) {
    const children = fs
      .readdirSync(apiDirAbs, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    md += `| Module | Reference |\n|--------|----------|\n`;
    for (const child of children) {
      const childDir = path.join(apiDirAbs, child);
      const childReadme = path.join(childDir, "README.md");
      if (!fs.existsSync(childReadme)) continue;
      if (moduleIsDefaultOnly(childDir)) continue;
      md += `| \`${child}\` | [API](${relLink(readmeAbs, childReadme)}) |\n`;
    }
    md += `\n<details>\n<summary>All exports (${symbols.length})</summary>\n\n`;
    md += `| Symbol | Kind | Detail |\n|--------|------|--------|\n`;
    for (const s of symbols) {
      md += `| \`${s.name}\` | ${s.kind} | [docs](${relLink(readmeAbs, s.file)}) |\n`;
    }
    md += `\n</details>\n\n${END}\n`;
    return md;
  }

  for (const [kind, list] of byKind) {
    md += `### ${kindTitle[kind] || kind}\n\n`;
    md += `| Symbol | Detail |\n|--------|--------|\n`;
    for (const s of list) {
      md += `| \`${s.name}\` | [docs](${relLink(readmeAbs, s.file)}) |\n`;
    }
    md += `\n`;
  }
  md += `${END}\n`;
  return md;
}

function upsertSection(readmeRel, section) {
  const abs = path.join(ROOT, readmeRel);
  if (!fs.existsSync(abs)) {
    console.warn("skip missing", readmeRel);
    return false;
  }
  let text = fs.readFileSync(abs, "utf8");
  if (text.includes(START) && text.includes(END)) {
    text = text.replace(
      new RegExp(`${START}[\\s\\S]*?${END}\\n?`),
      section,
    );
  } else {
    if (!text.endsWith("\n")) text += "\n";
    text += `\n${section}`;
  }
  fs.writeFileSync(abs, text);
  return true;
}

if (!fs.existsSync(API_ROOT)) {
  console.error("docs-append-api-indexes: missing", API_ROOT, "— run docs:typedoc first");
  process.exit(1);
}

// Root lib files (auth.ts etc.) live directly under frontend/lib — ensure lib/README covers them
let updated = 0;
for (const entry of MAP) {
  const { readme } = entry;
  let section;
  if (entry.custom === "routes") {
    section = buildRoutesSection(path.join(ROOT, readme));
  } else {
    const apiDir = path.join(API_ROOT, entry.apiRel);
    if (!fs.existsSync(apiDir)) {
      console.warn("no api dir yet:", entry.apiRel);
      continue;
    }
    section = buildSection(path.join(ROOT, readme), apiDir);
  }
  if (upsertSection(readme, section)) {
    updated++;
    console.log("updated", readme);
  }
}

// Also append hub link on docs/reference/README.md modules list pointer
const hub = path.join(ROOT, "docs/reference/README.md");
const hubSection =
  `${START}\n\n## Generated modules\n\n` +
  `Full module list: [CSS Atlas API](api/README.md).\n\n${END}\n`;
upsertSection("docs/reference/README.md", hubSection);

console.log(`docs-append-api-indexes: updated ${updated} handbook READMEs`);
