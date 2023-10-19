import { assertSnapshot } from "../lib/std/testing.ts";
import { createLanguageSpecMap } from "./generate.ts";

Deno.test("createLanguageSpecs", { ignore: true }, async (t) => {
  const specs = await createLanguageSpecMap();
  await assertSnapshot(t, specs);
});
