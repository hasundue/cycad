import { TreeSitter } from "../lib/npm/web-tree-sitter.ts";
import { Language } from "./langs.generated.ts";
import { getLanguageWasmPath } from "./paths.ts";
import { buildParser } from "./build.ts";

// We have to redeclare the parse() method because Deno doesn't generate
// the correct type definition from npm:web-tree-sitter.
export interface Parser extends TreeSitter {
  parse(
    input: string | TreeSitter.Input,
    previousTree?: TreeSitter.Tree,
    options?: TreeSitter.Options,
  ): TreeSitter.Tree;
}

export const Parser = {
  async create(lang: Language): Promise<Parser> {
    // TODO: Should we avoid calling init() multiple times?
    await TreeSitter.init();

    const wasm = getLanguageWasmPath(lang);
    if (await wasm.exists() === false) {
      await buildParser(lang);
    }
    const Lang = await TreeSitter.Language.load(wasm.toString());

    const parser = new TreeSitter();
    parser.setLanguage(Lang);

    return parser;
  },
};
