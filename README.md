# 🌴 Cycad

> **Warning**\
> This project is still in early development. The API may change at any time.

Cycad is a helper module for using [Tree-sitter][tree-sitter] in [Deno][deno].

## Requirements

- [Deno][deno]
- [Tree-sitter][tree-sitter] (optional, Cycad may fetch a binary automatically)
- [Emscripten][emscripten] (optional, Tree-sitter may fetch a container
  automatically)

## Usage

```typescript
import { Parser } from "https://deno.land/x/cycad@{VERSION}/mod.ts";

// Parser for TypeScript will be fetched and compiled automatically!
// It may take a while for the first run.
const parser = await Parser.create("typescript");

const tree = parser.parse("const x = 1;");
console.log(tree.rootNode.toString());
```

Or, you may import the parser directly without async code:

```typescript
import { parser } from "https://deno.land/x/cycad@{VERSION}/parser.ts?lang=typescript";

const tree = parser.parse("const x = 1;");
console.log(tree.rootNode.toString());
```

<!-- links -->

[tree-sitter]: https://tree-sitter.github.io/tree-sitter/
[deno]: https://deno.land/manual/getting_started/installation
[emscripten]: https://emscripten.org/docs/getting_started/downloads.html
