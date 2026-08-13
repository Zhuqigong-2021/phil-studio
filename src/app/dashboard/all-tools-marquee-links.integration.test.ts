import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./page.tsx", import.meta.url), "utf8");

test("both seamless marquee copies retain each tool link", () => {
  assert.doesNotMatch(source, /href=\{duplicate \? undefined : t\.href\}/);
  assert.doesNotMatch(source, /id=\{duplicate \? undefined : t\.id\}/);
  assert.match(source, /href=\{t\.href\}/);
  assert.match(source, /id=\{t\.id\}/);
});
