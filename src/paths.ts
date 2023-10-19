import $, { PathRef } from "https://deno.land/x/dax@0.35.0/mod.ts";
import { createGraph } from "https://deno.land/x/deno_graph@0.57.1/mod.ts";
import { DenoDir } from "https://deno.land/x/deno_cache@0.6.0/deno_dir.ts";
import { Language, LanguageSpecMap } from "./langs.generated.ts";
import { throw_ } from "./utils.ts";
import { installTreeSitter } from "./install.ts";

const DENO_CACHE = $.path(
  new DenoDir().root ?? throw_(new Error("DENO_CACHE not found")),
);

export async function getTreeSitterCacheDir(): Promise<PathRef> {
  // Parse the import statement of npm:tree-sitter-cli in deps.ts
  const deps = new URL("./deps.ts", import.meta.url).href;
  const graph = await createGraph(deps);
  const json =
    graph.modules.flatMap((m) => m.dependencies ?? []).find((d) =>
      d.specifier.startsWith("npm:tree-sitter-cli")
    ) ?? throw_(new Error("tree-sitter-cli not found in deps.ts"));

  // Cache npm:tree-sitter-cli
  await $`deno cache ${deps}`;

  const version = json.specifier.split("@")[1];
  return $.path(
    `${DENO_CACHE}/npm/registry.npmjs.org/tree-sitter-cli/${version}`,
  );
}

export async function getTreeSitterExecutablePath(): Promise<PathRef> {
  const exe = await $.which("tree-sitter");
  if (exe) {
    return $.path(exe);
  }
  const dir = await getTreeSitterCacheDir();
  const bin = dir.join("tree-sitter");
  if (await bin.exists() === false) {
    await installTreeSitter();
  }
  return bin;
}

/** Parse the repository specifier (e.g. tree-sitter/tree-sitter-javascript) from a URL */
function getRepositorySpec(lang: Language): string {
  const url = new URL(LanguageSpecMap[lang].url);
  return url.pathname.slice(1);
}

/** Get a full path of the directory where the repository is cloned */
export function getVendorDir(lang: Language, root = "./vendor"): PathRef {
  const repo = getRepositorySpec(lang);
  return $.path(root).resolve().join(repo);
}

export function getLanguageDir(
  lang: Language,
  vendorRoot = "./vendor",
): PathRef {
  const vendor = getVendorDir(lang, vendorRoot);
  const location = LanguageSpecMap[lang].location;
  return vendor.join(location);
}

export function getLanguageWasmPath(lang: Language, dist = "./dist"): PathRef {
  return $.path(dist).resolve().join(
    `tree-sitter-${LanguageSpecMap[lang].language}.wasm`,
  );
}
