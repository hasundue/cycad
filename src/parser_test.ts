import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts";
import { Parser } from "./parser.ts";

Deno.test("parser", async () => {
  const parser = await Parser.create("markdown");
  const tree = parser.parse(`Hello, World!`);
  assertEquals(
    tree.rootNode.toString(),
    `(document (section (paragraph (inline))))`,
  );
});
