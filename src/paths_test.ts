import { assertEquals } from "../lib/std/assert.ts";
import {
  getLanguageDir,
  getLanguageWasmPath,
  getTreeSitterCacheDir,
  getTreeSitterExecutablePath,
  getVendorDir,
} from "./paths.ts";

Deno.test("getTreeSitterCacheDir", async () => {
  const dir = await getTreeSitterCacheDir();
  assertEquals(await dir.exists(), true);
});

Deno.test("getTreeSitterExecutablePath", async () => {
  const path = await getTreeSitterExecutablePath();
  assertEquals(await path.exists(), true);
});

Deno.test("getVendorDir", async () => {
  const dir = getVendorDir("javascript");
  assertEquals(await dir.exists(), false);
});

Deno.test("getLanguageDir", async () => {
  const dir = getLanguageDir("javascript");
  assertEquals(await dir.exists(), false);
});

Deno.test("getLanguageWasmPath", async () => {
  const path = getLanguageWasmPath("javascript");
  assertEquals(await path.exists(), false);
});
