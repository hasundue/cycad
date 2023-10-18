import TreeSitter from "npm:web-tree-sitter";

await TreeSitter.init();

const parser = new TreeSitter();
parser.setLanguage(JavaScript);

const src = Deno.readTextFileSync("README.md");
const tree = parser.parse(src);
console.log(tree.rootNode.toString());
