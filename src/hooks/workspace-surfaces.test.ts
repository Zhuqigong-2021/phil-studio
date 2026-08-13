import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const favoriteMutationHookNames = ["useDashboardState", "useAllPageState", "useFavsPageState"];

test("tool list surfaces persist favorites through useCustomTools", () => {
  for (const name of favoriteMutationHookNames) {
    const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");
    assert.match(source, /setToolFavorite/, `${name} must use the persistent favorite mutation`);
    assert.doesNotMatch(source, /setFavOverrides/, `${name} must not keep a browser-only favorite source of truth`);
  }
});

test("Manage persists the favorite row draft through its update mutation", () => {
  const source = readFileSync(new URL("./useManagePageState.ts", import.meta.url), "utf8");
  assert.match(source, /patch = validateManageDraft\(draft, tableState\.aliasInputs\[id\] \?\? "", categories\)/);
  assert.match(source, /mutate: \(\) => updateTool\(id, patch\)/);
  assert.doesNotMatch(source, /setFavOverrides/);
});

test("Manage reports unchanged updates before starting a database mutation", () => {
  const source = readFileSync(new URL("./useManagePageState.ts", import.meta.url), "utf8");
  assert.match(source, /isManagePatchUnchanged\(tool, pinnedToolIds\.includes\(id\), patch\)/);
  assert.match(source, /tone: "info", message: `No changes to update: \$\{tool\.name\}`/);
});

test("recent surfaces consume the server-backed workspace snapshot", () => {
  for (const name of ["useDashboardState", "useRecentPageState"]) {
    const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");
    assert.match(source, /recentTools: storedRecentTools/, `${name} must use workspace recent records`);
  }
});

test("dashboard favorite controls call the shared persistent mutation", () => {
  const source = readFileSync(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8");
  assert.match(source, /const DashboardWorkspaceContext = React\.createContext<ReturnType<typeof useCustomTools> \| null>\(null\)/);
  assert.match(source, /const \{ tools, categories, setToolFavorite, favoritePendingIds \} = useDashboardWorkspace\(\)/);
  assert.match(source, /void setToolFavorite\(id, !currentFavorite\)\.catch\(\(\) => undefined\)/);
  assert.match(source, /void setToolFavorite\(t\.id, !isFavorite\)\.catch\(\(\) => undefined\)/);
  assert.doesNotMatch(source, /useFavorites\(\)/);
  assert.doesNotMatch(source, /toggleFavoriteRaw/);
});

test("Quick Access preserves database update time and returns to Add Tool after pin changes", () => {
  const source = readFileSync(new URL("../app/dashboard/page.tsx", import.meta.url), "utf8");
  assert.match(source, /updatedAt: tool\.updatedAt/);
  assert.match(source, /quickAccessScrollRef/);
  assert.match(source, /quickAccessOrderKey/);
  assert.match(source, /scrollTo\(\{ left: 0, behavior: "smooth" \}\)/);
});
