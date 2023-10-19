import { $, type PathRef } from "../lib/x/dax.ts";
import { createGraph } from "../lib/x/deno_graph.ts";
import { DenoDir } from "../lib/x/deno_cache.ts";
import { Language, LanguageSpecMap } from "./langs.generated.ts";
import { throw_ } from "./utils.ts";
import { installTreeSitter } from "./install.ts";

const DENO_CACHE = $.path(
  new DenoDir().root ?? throw_(new Error("DENO_CACHE not found")),
);

export async function getTreeSitterCacheDir(): Promise<PathRef> {
  // Parse the import statement of npm:tree-sitter-cli in deps.ts
  const deps = new URL("../lib/npm/tree-sitter-cli.ts", import.meta.url).href;
  const graph = await createGraph(deps);
  const json =
    graph.modules.flatMap((m) => m.dependencies ?? []).find((d) =>
      d.specifier.startsWith("npm:tree-sitter-cli")
    ) ??
      throw_(
        new Error(
          "Could not find an import statement for tree-sitter-cli in ./lib/npm/tree-sitter-cli.ts",
        ),
      );

  // Cache npm:tree-sitter-cli
  await $`deno cache ${deps}`;

  const version = json.specifier.split("@")[1];
  return $.path(
    `${DENO_CACHE}/npm/registry.npmjs.org/tree-sitter-cli/${version}`,
  );
}

export async function getTreeSitterExecutablePath(): Promise<PathRef> {
  const cmd = Deno.build.os === "windows" ? "tree-sitter.exe" : "tree-sitter";
  const found = await $.which(cmd);
  if (found) {
    return $.path(found);
  }
  const dir = await getTreeSitterCacheDir();
  const bin = dir.join(cmd);
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
