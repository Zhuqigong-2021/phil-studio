import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addPinnedToolId, removePinnedToolId } from "../lib/dashboard/custom-tools.ts";
import type { WorkspaceSnapshot } from "../lib/dashboard/workspace-data.ts";
import {
  createFavoritePendingTracker,
  deleteWorkspaceToolAndRefresh,
  updateWorkspaceToolAndRefresh,
  type WorkspaceApi,
} from "./useCustomTools.ts";

const snapshot: WorkspaceSnapshot = {
  tools: [],
  categories: [],
  pinnedToolIds: [],
  recentTools: [],
};

function workspaceApi(overrides: Partial<WorkspaceApi> = {}): WorkspaceApi {
  return {
    fetchSnapshot: async () => snapshot,
    migrate: async () => snapshot,
    postTool: async () => { throw new Error("unused"); },
    postCategory: async () => { throw new Error("unused"); },
    patchTool: async () => { throw new Error("unused"); },
    deleteTool: async () => undefined,
    ...overrides,
  };
}

test("updates only after the server confirms and then applies a fresh snapshot", async () => {
  const calls: string[] = [];
  let resolvePatch!: () => void;
  const patch = new Promise<void>((resolve) => { resolvePatch = resolve; });
  const next = { ...snapshot, categories: ["Work"] };
  const applied: WorkspaceSnapshot[] = [];
  const pending = updateWorkspaceToolAndRefresh(
    workspaceApi({
      patchTool: async () => { calls.push("patch"); await patch; return undefined as never; },
      fetchSnapshot: async () => { calls.push("fetch"); return next; },
    }),
    "tool-1",
    { name: "Notes" },
    (value) => applied.push(value),
  );

  assert.deepEqual(calls, ["patch"]);
  resolvePatch();
  await pending;
  assert.deepEqual(calls, ["patch", "fetch"]);
  assert.deepEqual(applied, [next]);
});

test("deletes with the injected API then applies its fresh snapshot", async () => {
  const calls: string[] = [];
  const next = { ...snapshot, categories: ["Productivity"] };
  const applied: WorkspaceSnapshot[] = [];

  await deleteWorkspaceToolAndRefresh(
    workspaceApi({
      deleteTool: async () => { calls.push("delete"); },
      fetchSnapshot: async () => { calls.push("fetch"); return next; },
    }),
    "tool-1",
    (value) => applied.push(value),
  );

  assert.deepEqual(calls, ["delete", "fetch"]);
  assert.deepEqual(applied, [next]);
});

test("leaves committed workspace state untouched when an update fails", async () => {
  const applied: WorkspaceSnapshot[] = [];

  await assert.rejects(
    () => updateWorkspaceToolAndRefresh(
      workspaceApi({ patchTool: async () => { throw new Error("offline"); } }),
      "tool-1",
      { name: "Notes" },
      (value) => applied.push(value),
    ),
    /offline/,
  );

  assert.deepEqual(applied, []);
});

test("tracks a favorite request once and removes its pending id in finally", () => {
  const pending = createFavoritePendingTracker();
  assert.equal(pending.begin("tool-1"), true);
  assert.equal(pending.begin("tool-1"), false);
  assert.deepEqual(pending.ids(), ["tool-1"]);
  pending.finish("tool-1");
  assert.deepEqual(pending.ids(), []);
});

test("adds and removes pinned IDs without duplicates or mutation", () => {
  const original = ["built-in"];
  assert.deepEqual(addPinnedToolId(original, "custom"), ["built-in", "custom"]);
  assert.deepEqual(addPinnedToolId(original, "built-in"), ["built-in"]);
  assert.deepEqual(removePinnedToolId(["built-in", "custom"], "built-in"), ["custom"]);
  assert.deepEqual(original, ["built-in"]);
});

test("hook preserves feature storage keys and starts deferred server synchronization", () => {
  const source = readFileSync(new URL("./useCustomTools.ts", import.meta.url), "utf8");
  assert.match(source, /CUSTOM_CATEGORIES_KEY/);
  assert.match(source, /CUSTOM_TOOLS_KEY/);
  assert.match(source, /PINNED_TOOLS_KEY/);
  assert.match(source, /CUSTOM_TOOLS_CHANGED_EVENT/);
  assert.match(source, /addEventListener\("storage"/);
  assert.match(source, /SUPABASE_MIGRATED_KEY/);
  assert.match(source, /setTimeout\(\(\) =>/);
  assert.match(source, /void retrySync\(\)/);
  assert.match(source, /deleteTool\(id: string\): Promise<void>/);
  assert.match(source, /refreshTools/);
  assert.match(source, /updateTool/);
  assert.match(source, /favoritePendingIds/);
  assert.doesNotMatch(source, /crypto\.randomUUID/);
});
