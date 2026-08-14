import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("action-only dashboard consumers do not subscribe to the full workspace snapshot", () => {
  assert.match(page, /DashboardWorkspaceActionsContext/);
  assert.match(page, /useDashboardWorkspaceActions/);
  assert.match(page, /React\.useMemo\(\(\) => \(\{/);
  assert.match(page, /const \{ setToolFavorite, favoritePendingIds \} = useDashboardWorkspaceActions\(\)/);
});
