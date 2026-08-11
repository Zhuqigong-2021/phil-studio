import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("./page.tsx", import.meta.url);

test("dashboard uses one workspace snapshot for counts, favorites, and mutations", async () => {
  const source = await readFile(pageUrl, "utf8");

  assert.doesNotMatch(source, /import\s+\{\s*useFavorites\s*\}/);
  assert.match(source, /const DashboardWorkspaceContext = React\.createContext<ReturnType<typeof useCustomTools> \| null>\(null\)/);
  assert.match(source, /function useDashboardWorkspace\(\)/);
  assert.match(source, /function DashboardWorkspaceProvider\(\{ children \}: \{ children: React\.ReactNode \}\)/);

  const customToolCalls = source.match(/useCustomTools\(\)/g) ?? [];
  assert.equal(customToolCalls.length, 1);
  assert.match(source, /function DashboardPageContent\(\)/);
  assert.match(source, /<DashboardWorkspaceProvider>\s*<DashboardPageContent \/>\s*<\/DashboardWorkspaceProvider>/);

  assert.match(source, /const \{ tools, categories, setToolFavorite \} = useDashboardWorkspace\(\)/);
  assert.match(source, /const categoryCount = categories\.length/);
  assert.match(source, /toolViews\.filter\(\(view\) => view\.tool\.favorite\)/);
  assert.match(source, /const favoriteCount = favoriteTools\.length/);
  assert.match(source, /categoryCount=\{categoryCount\}/);
  assert.match(source, /favoriteCount=\{favoriteCount\}/);
  assert.match(source, /value=\{String\(categoryCount\)\}/);
  assert.match(source, /value=\{String\(favoriteCount\)\}/);
  assert.match(source, /void setToolFavorite\(id, !currentFavorite\)\.catch\(\(\) => undefined\)/);
  assert.doesNotMatch(source, /baseFavoriteById|favOverrides/);
});
