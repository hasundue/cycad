/**
 * A helper module to use tree-sitter from Deno.
 *
 * ## Example
 *
 * ```ts
 * import { Parser } from "https://deno.land/x/cycad@{version}/mod.ts";
 *
 * // It may take a while for the first run, because it fetches the parser and
 * // compiles it to WebAssembly.
 * const parser = await Parser.create("typescript");
 *
 * const tree = parser.parse(`const x = 1;`);
 * console.log(tree.rootNode.toString());
 * ```
 *
 * @module
 */

export { Parser } from "./src/parser.ts";
