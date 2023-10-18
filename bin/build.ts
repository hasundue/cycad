import { TREE_SITTER } from "../src/paths.ts";
import { installTreeSitter } from "../bin/install.ts";

const TreeSitter = {
  get isGloballyInstalled() {
    try {
      new Deno.Command("tree-sitter").outputSync();
      return true;
    } catch {
      return false;
    }
  },
  get isLocallyInstalled() {
    try {
      new Deno.Command(TREE_SITTER).outputSync();
      return true;
    } catch {
      return false;
    }
  },
};

async function getTreeSitterExecutablePath() {
  if (TreeSitter.isGloballyInstalled) {
    return "tree-sitter";
  }
  if (TreeSitter.isLocallyInstalled) {
    return TREE_SITTER;
  }
  await installTreeSitter();
  return TREE_SITTER;
}

async function buildParser(lang: string) {
  const TREE_SITTER = await getTreeSitterExecutablePath();
}

if (import.meta.main) {
  await Promise.all(Deno.args.map(buildParser));
}
