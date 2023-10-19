import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { getTreeSitterCacheDir } from "./locations.ts";

export async function installTreeSitter() {
  // Cache tree-sitter-cli
  const url = new URL("./deps.ts", import.meta.url);
  const path = url.protocol === "file:" ? url.pathname : url.href;

  await $.progress(`Caching npm:tree-sitter-cli`)
    .with(async () => await $`deno cache ${path}`.quiet());

  // Install tree-sitter executable
  const dir = await getTreeSitterCacheDir();
  await $.progress(`Installing tree-sitter executable`)
    .with(async () => await $`deno task install`.cwd(dir).quiet());
}

if (import.meta.main) {
  try {
    await installTreeSitter();
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}
