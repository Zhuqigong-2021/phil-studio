import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const hookNames = ["useDashboardState", "useAllPageState", "useFavsPageState", "useManagePageState"];

test("tool surfaces persist favorites through useCustomTools", () => {
  for (const name of hookNames) {
    const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");
    assert.match(source, /setToolFavorite/, `${name} must use the persistent favorite mutation`);
    assert.doesNotMatch(source, /setFavOverrides/, `${name} must not keep a browser-only favorite source of truth`);
  }
});

test("recent surfaces consume the server-backed workspace snapshot", () => {
  for (const name of ["useDashboardState", "useRecentPageState"]) {
    const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");
    assert.match(source, /recentTools: storedRecentTools/, `${name} must use workspace recent records`);
  }
});

test("dashboard favorite controls call the persistent mutation", () => {
  const source = readFileSync(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8");
  const favorites = readFileSync(new URL("./useFavorites.ts", import.meta.url), "utf8");
  assert.match(source, /useFavorites\(\)/);
  assert.match(favorites, /setToolFavorite/);
  assert.doesNotMatch(source, /toggleFavoriteRaw/);
});
