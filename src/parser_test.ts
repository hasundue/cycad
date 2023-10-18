import { Parser } from "./parser.ts";

const parser = await Parser.init("markdown");

const src = Deno.readTextFileSync("README.md");
const tree = parser.parse(src);
console.log(tree.rootNode.toString());
