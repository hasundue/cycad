import {
  assertSnapshot,
} from "https://deno.land/std@0.204.0/testing/snapshot.ts";
import { createLanguageSpecMap } from "./generate.ts";

Deno.test("createLanguageSpecs", { ignore: true }, async (t) => {
  const specs = await createLanguageSpecMap();
  await assertSnapshot(t, specs);
});
