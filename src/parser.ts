import { exists } from "https://deno.land/std@0.204.0/fs/exists.ts";
import TreeSitter from "npm:web-tree-sitter@0.20.8";
import { Language } from "./langs.generated.ts";
import { getLanguageWasmPath } from "./locations.ts";
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

export const Parser = {
  async create(lang: Language): Promise<Parser> {
    // TODO: Should we avoid calling init() multiple times?
    await TreeSitter.init();

    const wasm = getLanguageWasmPath(lang).pathname;
    if (!(await exists(wasm))) {
      await buildParser(lang);
    }
    const Lang = await TreeSitter.Language.load(wasm);

    const parser = new TreeSitter();
    parser.setLanguage(Lang);

    return parser;
  },
};
