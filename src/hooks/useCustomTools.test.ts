import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addPinnedToolId, removePinnedToolId } from "../lib/dashboard/custom-tools.ts";
import type { WorkspaceSnapshot } from "../lib/dashboard/workspace-data.ts";
import {
  createFavoritePendingTracker,
  deleteWorkspaceToolAndRefresh,
  refreshWorkspaceTools,
  runFavoriteMutationWithPending,
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

test("refreshes tools from the injected API and applies its fresh snapshot", async () => {
  const next = { ...snapshot, categories: ["Fresh"] };
  const applied: WorkspaceSnapshot[] = [];

  const result = await refreshWorkspaceTools(
    workspaceApi({ fetchSnapshot: async () => next }),
    (value) => applied.push(value),
  );

  assert.equal(result, next);
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

test("leaves committed workspace state untouched when a delete fails", async () => {
  const applied: WorkspaceSnapshot[] = [];
  let fetched = false;

  await assert.rejects(
    () => deleteWorkspaceToolAndRefresh(
      workspaceApi({
        deleteTool: async () => { throw new Error("offline"); },
        fetchSnapshot: async () => { fetched = true; return snapshot; },
      }),
      "tool-1",
      (value) => applied.push(value),
    ),
    /offline/,
  );

  assert.equal(fetched, false);
  assert.deepEqual(applied, []);
});

test("runs one favorite mutation while exposing and clearing the pending id on success", async () => {
  const pending = createFavoritePendingTracker();
  const pendingStates: string[][] = [];
  let resolveMutation!: () => void;
  const mutation = new Promise<void>((resolve) => { resolveMutation = resolve; });
  let mutationCalls = 0;
  const first = runFavoriteMutationWithPending({
    id: "tool-1",
    pending,
    setPendingIds: (ids) => pendingStates.push(ids),
    mutate: async () => { mutationCalls += 1; await mutation; },
  });

  assert.deepEqual(pendingStates, [["tool-1"]]);
  assert.equal(await runFavoriteMutationWithPending({
    id: "tool-1",
    pending,
    setPendingIds: (ids) => pendingStates.push(ids),
    mutate: async () => { mutationCalls += 1; },
  }), false);
  assert.equal(mutationCalls, 1);

  resolveMutation();
  assert.equal(await first, true);
  assert.deepEqual(pendingStates, [["tool-1"], []]);
});

test("clears the favorite pending id in finally when the mutation fails", async () => {
  const pending = createFavoritePendingTracker();
  const pendingStates: string[][] = [];

  await assert.rejects(
    () => runFavoriteMutationWithPending({
      id: "tool-1",
      pending,
      setPendingIds: (ids) => pendingStates.push(ids),
      mutate: async () => { throw new Error("offline"); },
    }),
    /offline/,
  );

  assert.deepEqual(pendingStates, [["tool-1"], []]);
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
