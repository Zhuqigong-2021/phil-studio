import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const styles = readFileSync("src/styles/secondary.css", "utf8");

test("table category filter does not draw a clipped focus outline", () => {
  const rule = styles.match(/\.category-table-filter-option:focus-within\s*\{([^}]*)\}/)?.[1] ?? "";
  assert.match(rule, /outline:\s*none/);
  assert.doesNotMatch(rule, /outline:\s*2px/);
});
