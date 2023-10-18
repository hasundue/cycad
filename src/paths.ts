import { DenoDir } from "https://deno.land/x/deno_cache@0.6.0/deno_dir.ts";
import { homeDir } from "https://deno.land/x/deno_cache@0.6.0/dirs.ts";

function notFound(dir: string): never {
  throw new Error(`${dir} directory not found`);
}

export const CACHE = new DenoDir().root ?? notFound("Cache");
export const HOME = homeDir() ?? notFound("Home");
export const TREE_SITTER_CLI =
  `${CACHE}/npm/registry.npmjs.org/tree-sitter-cli/0.20.8`;

export const DENO = Deno.env.get("DENO_INSTALL_ROOT") ?? `${HOME}/.deno/bin/`;
export const TREE_SITTER = `${TREE_SITTER_CLI}/tree-sitter`;
