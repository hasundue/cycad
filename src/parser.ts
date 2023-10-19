import { exists } from "https://deno.land/std@0.204.0/fs/exists.ts";
import TreeSitter from "npm:web-tree-sitter@0.20.8";
import { isLanguage } from "./langs.generated.ts";
import { getLanguagePath } from "./paths.ts";
import { buildParser } from "./build.ts";

export interface Parser extends TreeSitter {
  parse(
    input: string | TreeSitter.Input,
    previousTree?: TreeSitter.Tree,
    options?: TreeSitter.Options,
  ): TreeSitter.Tree;
  reset(): void;
  getLogger(): TreeSitter.Logger;
  setLogger(logFunc?: TreeSitter.Logger | undefined | null): void;
  setTimeoutMicros(value: number): void;
  getTimeoutMicros(): number;
}

await TreeSitter.init();

const lang = new URL(import.meta.url).hash.slice(1);
console.log(lang);

if (!isLanguage(lang)) {
  throw new TypeError(`Unknown language: ${lang}`);
}

const wasm = getLanguagePath(lang);

if (!(await exists(wasm))) {
  await buildParser(lang);
}

const Lang = await TreeSitter.Language.load(wasm);

const _parser = new TreeSitter();
_parser.setLanguage(Lang);

export const parser: Parser = _parser;
