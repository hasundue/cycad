import TreeSitter from "npm:web-tree-sitter";
import { Language } from "./langs.generated.ts";

class _TreeSitter {
  static #initialized = false;

  static async initialized() {
    if (this.#initialized) {
      return;
    }
    await TreeSitter.init();
    this.#initialized = true;
  }
}

export interface Parser<L extends Language = Language> {
  parse: typeof TreeSitter.prototype.parse;
}

export const Parser = {
  async init<L extends Language>(lang: L): Promise<Parser<L>> {
    await _TreeSitter.initialized();
    const parser = new TreeSitter();
    const Lang = await TreeSitter.Language.load();
    parser.setLanguage();
    return {
      parse: parser.parse,
    };
  },
};
