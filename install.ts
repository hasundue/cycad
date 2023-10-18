import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { TREE_SITTER_CACHE } from "./src/paths.ts";

export async function installTreeSitter() {
  // Cache tree-sitter-cli
  const url = new URL("./src/deps.ts", import.meta.url);
  const path = url.protocol === "file:" ? url.pathname : url.href;
  await $`deno cache ${path}`;

  // Install tree-sitter executable
  $.cd(TREE_SITTER_CACHE);
  await $`deno task -q install`;
}

if (import.meta.main) {
  try {
    await installTreeSitter();
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}
