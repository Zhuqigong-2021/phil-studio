import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./useShellState.ts", import.meta.url), "utf8");

test("command palette tool search includes aliases", () => {
  const start = source.indexOf("export function buildToolResults");
  const end = source.indexOf("export function buildCommandResults", start);
  assert.match(source.slice(start, end), /t\.aliases\?\.some/);
});
