/**
 * A sub-module of cycad_sitter which provides a parser without async operations.
 *
 * ## Example
 *
 * ```ts
 * import { parser } from "https://deno.land/x/cycad@{version}/parser.ts?lang=typescript";
 *
 * const tree = parser.parse(`const x = 1;`);
 * console.log(tree.rootNode.toString());
 * ```
 *
 * @module
 */

import { isLanguage } from "./src/langs.generated.ts";
import { Parser } from "./src/parser.ts";

const lang = new URL(import.meta.url).searchParams.get("lang");

if (!lang) {
  throw new Error(`Missing language parameter in URL: ${import.meta.url}`);
}
if (!isLanguage(lang)) {
  throw new TypeError(`Unknown language: ${lang}`);
}

export const parser = await Parser.create(lang);
