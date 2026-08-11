import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { TOOL_ICONS } from "./tool-icons.ts";

const loaderUrl = new URL("./tool-icon-loaders.ts", import.meta.url);

test("contains one explicit dynamic import for each allowlisted icon", async () => {
  const source = await readFile(loaderUrl, "utf8");
  const imports = source.match(/:\s*\(\)\s*=>\s*import\(/g) ?? [];

  assert.equal(imports.length, 500);
  for (const icon of TOOL_ICONS) {
    const lucideName = icon.lucideName ?? icon.key;
    assert.match(source, new RegExp(`"${icon.key}":`));
    assert.ok(
      source.includes(`/icons/${lucideName}.mjs`),
      `${icon.key} must load ${lucideName}`,
    );
  }
});
