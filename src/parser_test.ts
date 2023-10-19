import {
  assertSnapshot,
} from "https://deno.land/std@0.204.0/testing/snapshot.ts";
import { parser } from "./parser.ts#markdown";

Deno.test("parser", async (t) => {
  const src = await Deno.readTextFile("README.md");
  const tree = parser.parse(src);
  await assertSnapshot(t, tree.rootNode.toString());
});
