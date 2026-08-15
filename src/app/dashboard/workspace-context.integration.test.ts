import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");
const provider = readFileSync("src/components/dashboard/DashboardWorkspaceProvider.tsx", "utf8");

test("action-only dashboard consumers do not subscribe to the full workspace snapshot", () => {
  assert.match(provider, /const ActionsContext/);
  assert.match(page, /useDashboardWorkspaceActions/);
  assert.match(provider, /const actions = React\.useMemo<DashboardWorkspaceActions>/);
  assert.match(page, /const \{ setToolFavorite \} = useDashboardWorkspaceActions\(\)/);
  assert.match(page, /const \{ favoritePendingIds \} = useDashboardPendingState\(\)/);
});
