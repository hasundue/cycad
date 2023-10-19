import { resolve, toFileUrl } from "https://deno.land/std@0.204.0/path/mod.ts";
import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { createGraph } from "https://deno.land/x/deno_graph@0.57.1/mod.ts";
import { DenoDir } from "https://deno.land/x/deno_cache@0.6.0/deno_dir.ts";
import { Language, LanguageSpecMap } from "./langs.generated.ts";
import { throw_ } from "./utils.ts";
import { installTreeSitter } from "./install.ts";

const DENO_CACHE = toFileUrl(
  new DenoDir().root ?? throw_(new Error("DENO_CACHE not found")),
);

export async function getTreeSitterCacheDir(): Promise<URL> {
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
  return toFileUrl(
    `${DENO_CACHE.pathname}/npm/registry.npmjs.org/tree-sitter-cli/${version}`,
  );
}

export async function getTreeSitterExecutablePath(): Promise<URL> {
  let bin = await $.which("tree-sitter");
  if (bin) {
    return toFileUrl(bin);
  }
  const dir = await getTreeSitterCacheDir();
  bin = dir.pathname + "/tree-sitter";
  if (!$.path(bin).existsSync()) {
    await installTreeSitter();
  }
  return toFileUrl(bin);
}

/** Parse the repository specifier (e.g. tree-sitter/tree-sitter-javascript) from a URL */
function getRepositorySpec(lang: Language) {
  const url = new URL(LanguageSpecMap[lang].url);
  return url.pathname.slice(1);
}

/** Get a full path of the directory where the repository is cloned */
export function getVendorDir(lang: Language, root = "./vendor"): URL {
  const repo = getRepositorySpec(lang);
  return toFileUrl(resolve(`${root}/${repo}`));
}

export function getLanguageDir(lang: Language, vendorRoot = "./vendor"): URL {
  const vendor = getVendorDir(lang, vendorRoot);
  const location = LanguageSpecMap[lang].location;
  return toFileUrl(resolve(`${vendor.pathname}/${location}`));
}

export function getLanguageWasmPath(lang: Language, dist = "./dist"): URL {
  return toFileUrl(
    resolve(`${dist}/tree-sitter-${LanguageSpecMap[lang].language}.wasm`),
  );
}
