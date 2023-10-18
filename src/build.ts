import $ from "https://deno.land/x/dax@0.35.0/mod.ts";
import { Lang, LangOptions } from "./langs.generated.ts";

import { TREE_SITTER } from "./paths.ts";
import { installTreeSitter } from "./install.ts";

async function getTreeSitterExecutablePath() {
  if ($.commandExistsSync("tree-sitter")) {
    return "tree-sitter";
  }
  if ($.commandExistsSync(TREE_SITTER)) {
    return TREE_SITTER;
  }
  await installTreeSitter();
  return TREE_SITTER;
}

async function buildParser(lang: Lang) {
  const TREE_SITTER = await getTreeSitterExecutablePath();

  // Get repository name for langauge from nixpkgs
  const grammer = LangOptions[lang]?.grammar ?? lang;
  const json = await fetch(
    `https://raw.githubusercontent.com/NixOS/nixpkgs/master/pkgs/development/tools/parsing/tree-sitter/grammars/tree-sitter-${grammer}.json`,
  ).then((res) => {
    if (!res.ok) {
      throw new Error(
        `Could not find tree-sitter grammer for ${lang} in nixpkgs`,
      );
    }
    return res.json();
  });
  // Get repository name (e.g. tree-sitter/tree-sitter-javascript)
  const repo = new URL(json.url).pathname.slice(1);

  // Clone repository
  try {
    await $`mkdir -p vendor/${repo}`;
    await $`git clone ${json.url} vendor/${repo}`
      .stdout("inherit").stderr("null");
  } catch {
    // Update if already cloned
    await $`git -C vendor/${repo} pull`;
  }

  // Build parser
  const location = LangOptions[lang]?.location;
  const dir = location ? `vendor/${repo}/${location}` : `vendor/${repo}`;

  $.cd(dir);
  await $`${TREE_SITTER} build-wasm`;
}

if (import.meta.main) {
  try {
    await Promise.all(
      Deno.args.map((lang) => buildParser(lang as Lang)),
    );
    Deno.exit(0);
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}
