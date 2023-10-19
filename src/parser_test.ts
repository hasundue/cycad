import { assertEquals } from "../lib/std/assert.ts";
import { Parser } from "./parser.ts";

Deno.test("parser", async () => {
  const parser = await Parser.create("markdown");
  const tree = parser.parse(`Hello, World!`);
  assertEquals(
    tree.rootNode.toString(),
    `(document (section (paragraph (inline))))`,
  );
});
