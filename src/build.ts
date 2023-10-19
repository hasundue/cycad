import { resolve } from "../lib/std/path.ts";
import { $ } from "../lib/x/dax.ts";
import { Language, LanguageSpecMap } from "./langs.generated.ts";
import {
  getLanguageDir,
  getTreeSitterExecutablePath,
  getVendorDir,
} from "./paths.ts";

export async function buildParser(lang: Language, dist = "./dist") {
  const spec = LanguageSpecMap[lang];
  const vendor = getVendorDir(lang);
  try {
    // Clone repository
    await $`mkdir -p ${vendor}`;
    await $.progress(`Cloning ${lang} repository`)
      .with(async () => await $`git clone ${spec.url} ${vendor}`.quiet());
  } catch {
    // Update if already cloned
    await $.progress(`Updating ${lang} repository`)
      .with(async () => await $`git -C ${vendor} pull`.quiet());
  }
  const bin = await getTreeSitterExecutablePath();
  const dir = getLanguageDir(lang);
  dist = resolve(dist);
  await $`mkdir -p ${dist}`;
  await $.progress(`Building ${lang} parser`)
    .with(async () => await $`${bin} build-wasm ${dir}`.cwd(dist));
}

if (import.meta.main) {
  try {
    for (const lang of Deno.args) {
      await buildParser(lang as Language);
    }
  } catch (error) {
    console.error(error);
    Deno.exit(1);
  }
}
