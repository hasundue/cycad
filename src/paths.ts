import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { createGraph } from "https://deno.land/x/deno_graph@0.57.1/mod.ts";
import { DenoDir } from "https://deno.land/x/deno_cache@0.6.0/deno_dir.ts";
import { Language } from "./langs.generated.ts";
import { throw_ } from "./utils.ts";

function notFound(dir: string): never {
  throw new Error(`${dir} directory not found`);
}

export const DENO_CACHE = new DenoDir().root ?? notFound("Cache");

async function getTreeSitterCacheDir() {
  // Parse the import statement of npm:tree-sitter-cli in deps.ts
  const graph = await createGraph(new URL("./deps.ts", import.meta.url).href);
  const json =
    graph.modules.flatMap((m) => m.dependencies ?? []).find((d) =>
      d.specifier.startsWith("npm:tree-sitter-cli")
    ) ?? throw_(new Error("tree-sitter-cli not found in deps.ts"));

  // Cache npm:tree-sitter-cli
  $.cd(import.meta);
  await $`deno cache deps.ts`;

  const version = json.specifier.split("@")[1];
  return `${DENO_CACHE}/npm/registry.npmjs.org/tree-sitter-cli/${version}`;
}

export const TREE_SITTER_CACHE = await getTreeSitterCacheDir();

async function getTreeSitterExecutablePath() {
  if (await $.commandExists("tree-sitter")) {
    return "tree-sitter";
  }
  const cmd = await getTreeSitterCacheDir() + "/tree-sitter";
  if (await $.commandExists(cmd)) {
    return cmd;
  }
  throw new Error(
    "tree-sitter executable not found. Install tree-sitter CLI from the system package manager, or via 'deno run https://deno.land/x/cycad_sitter/install.ts'",
  );
}

export const TREE_SITTER = await getTreeSitterExecutablePath();

export function getLanguagePath(lang: Language) {
  const grammer = LanguageOptions[lang]?.grammar ?? lang;
  const location = LanguageOptions[lang]?.location;
  const dir = location ? `vendor/${repo}/${location}` : `vendor/${repo}`;
}
