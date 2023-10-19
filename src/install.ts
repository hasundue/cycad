import { $ } from "../lib/x/dax.ts";
import { getTreeSitterCacheDir, TSC_MODULE } from "./paths.ts";

export async function installTreeSitter() {
  // Cache tree-sitter-cli
  await $.progress(`Caching npm:tree-sitter-cli`)
    .with(async () => await $`deno cache ${TSC_MODULE}`.quiet());

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
