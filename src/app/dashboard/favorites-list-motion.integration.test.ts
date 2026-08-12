import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("Dashboard Favorites rows expose premium interaction motion", () => {
  assert.match(page, /getFavoriteRowMotion/);
  assert.match(page, /data-favorite-row/);
  assert.match(page, /data-favorite-row-glow/);
  assert.match(page, /data-favorite-external-link/);
  assert.match(page, /data-favorite-star/);
  assert.match(page, /whileHover=\{reduceMotion \? undefined : \{ transform: "translateX\(3px\)" \}\}/);
});
