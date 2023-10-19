/**
 * A helper module to use tree-sitter from Deno.
 *
 * ## Example
 *
 * ```ts
 * import { Parser } from "https://deno.land/x/cycad_sitter{version}/mod.ts";
 *
 * const parser = await Parser.create("markdown");
 * const tree = parser.parse(`Hello, World!`);
 * console.log(tree.rootNode.toString());
 * ```
 *
 * @module
 */

export { Parser } from "./src/parser.ts";
