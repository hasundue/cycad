import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { createGraph } from "https://deno.land/x/deno_graph@0.57.1/mod.ts";
import { CACHE } from "../src/paths.ts";

// Cache tree-sitter-cli
$.cd(import.meta);
await $`deno cache deps.ts`;

const graph = await createGraph(new URL("./deps.ts", import.meta.url).href);
const json = graph.modules.flatMap((m) => m.dependencies ?? []).find((d) =>
  d.specifier.startsWith("npm:tree-sitter-cli")
);
if (!json) {
  console.error("tree-sitter-cli not found in deps.ts");
  Deno.exit(1);
}
const version = json.specifier.split("@")[1];

// Install tree-sitter executable
$.cd(`${CACHE}/npm/registry.npmjs.org/tree-sitter-cli/${version}`);
await $`deno task install`;
