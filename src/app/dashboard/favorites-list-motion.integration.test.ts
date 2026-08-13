import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("Dashboard Favorites rows expose premium interaction motion", () => {
  assert.match(page, /data-favorite-row/);
  assert.match(page, /data-favorite-row-glow/);
  assert.match(page, /data-favorite-external-link/);
  assert.match(page, /data-favorite-star/);
  assert.match(page, /layout=\{!reduceMotion\}/);
  assert.match(page, /filter: "blur\(5px\)"/);
  assert.doesNotMatch(page, /data-favorite-row[\s\S]{0,700}whileHover=/);
});
