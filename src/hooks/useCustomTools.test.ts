import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { addPinnedToolId, removePinnedToolId } from "../lib/dashboard/custom-tools.ts";
import type { CustomToolDraft } from "../lib/dashboard/custom-tools.ts";
import type { Tool } from "../lib/dashboard/types.ts";
import type { WorkspaceSnapshot } from "../lib/dashboard/workspace-data.ts";
import {
  addWorkspaceToolAndRefresh,
  createFavoritePendingTracker,
  createWorkspaceMutationGuard,
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

const createdTool: Tool = {
  id: "tool-1",
  name: "Notion",
  url: "https://notion.so",
  description: "Connected notes workspace",
  mono: "NO",
  accent: "violet",
  tags: ["Productivity", "AI"],
  aliases: ["Notes", "Wiki"],
  favorite: false,
  sourceType: "external",
  iconKey: "notion",
  iconType: "matching",
};

const toolDraft: CustomToolDraft = {
  name: createdTool.name,
  url: createdTool.url ?? "",
  description: createdTool.description ?? "",
  iconKey: createdTool.iconKey ?? "notion",
  accent: createdTool.accent,
  tags: createdTool.tags,
  aliases: createdTool.aliases ?? [],
  sourceType: createdTool.sourceType ?? "external",
};

test("adds through POST and immediately applies the returned database tool without a full refresh", async () => {
  const calls: string[] = [];
  const applied: WorkspaceSnapshot[] = [];

  const result = await addWorkspaceToolAndRefresh(
    workspaceApi({
      postTool: async () => { calls.push("post"); return createdTool; },
      fetchSnapshot: async () => { calls.push("fetch"); return snapshot; },
    }),
    toolDraft,
    true,
    () => snapshot,
    (value) => applied.push(value),
  );

  assert.deepEqual(calls, ["post"]);
  assert.deepEqual(result, { tool: createdTool, workspaceRefreshFailed: false });
  assert.deepEqual(applied, [{ ...snapshot, tools: [createdTool], pinnedToolIds: [createdTool.id] }]);
});

test("does not depend on a second request after a tool is created", async () => {
  const applied: WorkspaceSnapshot[] = [];
  const current = { ...snapshot, categories: ["Existing"] };

  const result = await addWorkspaceToolAndRefresh(
    workspaceApi({
      postTool: async () => createdTool,
      fetchSnapshot: async () => { throw new Error("refresh offline"); },
    }),
    toolDraft,
    true,
    () => current,
    (value) => applied.push(value),
  );

  assert.deepEqual(result, { tool: createdTool, workspaceRefreshFailed: false });
  assert.deepEqual(applied, [{
    tools: [createdTool],
    categories: ["Existing"],
    pinnedToolIds: [createdTool.id],
    recentTools: [],
  }]);
});

test("rejects a pre-creation POST failure without fetching or applying workspace state", async () => {
  const applied: WorkspaceSnapshot[] = [];
  let fetched = false;

  await assert.rejects(
    () => addWorkspaceToolAndRefresh(
      workspaceApi({
        postTool: async () => { throw new Error("post offline"); },
        fetchSnapshot: async () => { fetched = true; return snapshot; },
      }),
      toolDraft,
      false,
      () => snapshot,
      (value) => applied.push(value),
    ),
    /post offline/,
  );

  assert.equal(fetched, false);
  assert.deepEqual(applied, []);
});

test("updates immediately from the confirmed PATCH response without a full snapshot", async () => {
  const calls: string[] = [];
  let resolvePatch!: () => void;
  const patch = new Promise<void>((resolve) => { resolvePatch = resolve; });
  const applied: WorkspaceSnapshot[] = [];
  const current = { ...snapshot, tools: [createdTool] };
  const pending = updateWorkspaceToolAndRefresh(
    workspaceApi({
      patchTool: async () => { calls.push("patch"); await patch; return createdTool; },
      fetchSnapshot: async () => { calls.push("fetch"); return snapshot; },
    }),
    "tool-1",
    { name: "Notes" },
    () => current,
    (value) => applied.push(value),
  );

  assert.deepEqual(calls, ["patch"]);
  resolvePatch();
  assert.deepEqual(await pending, { workspaceRefreshFailed: false, workspaceSnapshotApplied: true });
  assert.deepEqual(calls, ["patch"]);
  assert.equal(applied[0].tools[0].name, createdTool.name);
});

test("deletes immediately after confirmation without a full snapshot", async () => {
  const calls: string[] = [];
  const applied: WorkspaceSnapshot[] = [];

  const result = await deleteWorkspaceToolAndRefresh(
    workspaceApi({
      deleteTool: async () => { calls.push("delete"); },
      fetchSnapshot: async () => { calls.push("fetch"); return snapshot; },
    }),
    "tool-1",
    () => snapshot,
    (value) => applied.push(value),
  );

  assert.deepEqual(calls, ["delete"]);
  assert.deepEqual(applied[0].tools, []);
  assert.deepEqual(result, { workspaceRefreshFailed: false, workspaceSnapshotApplied: true });
});

test("keeps a successful update independent of snapshot availability", async () => {
  const before: WorkspaceSnapshot = { ...snapshot, tools: [createdTool], pinnedToolIds: [] };
  let current = before;
  const updated = { ...createdTool, name: "Updated Notion", favorite: true };

  const result = await updateWorkspaceToolAndRefresh(
    workspaceApi({
      patchTool: async () => updated,
      fetchSnapshot: async () => { throw new Error("refresh offline"); },
    }),
    createdTool.id,
    { name: updated.name, favorite: true, pinned: true },
    () => current,
    (value) => { current = value; },
  );

  assert.deepEqual(result, { workspaceRefreshFailed: false, workspaceSnapshotApplied: true });
  assert.equal(current.tools[0].name, updated.name);
  assert.equal(current.tools[0].favorite, true);
  assert.deepEqual(current.pinnedToolIds, [createdTool.id]);
});

test("keeps a successful deletion independent of snapshot availability", async () => {
  let current = {
    ...snapshot,
    tools: [createdTool],
    pinnedToolIds: [createdTool.id],
    recentTools: [{ id: createdTool.id, openedAt: 123 }],
  };

  const result = await deleteWorkspaceToolAndRefresh(
    workspaceApi({
      deleteTool: async () => undefined,
      fetchSnapshot: async () => { throw new Error("refresh offline"); },
    }),
    createdTool.id,
    () => current,
    (value) => { current = value; },
  );

  assert.deepEqual(result, { workspaceRefreshFailed: false, workspaceSnapshotApplied: true });
  assert.deepEqual(current.tools, []);
  assert.deepEqual(current.pinnedToolIds, []);
  assert.deepEqual(current.recentTools, []);
});

test("an older row refresh cannot overwrite a newer row mutation snapshot", async () => {
  const firstTool = { ...createdTool, id: "first", name: "First before" };
  const secondTool = { ...createdTool, id: "second", name: "Second before" };
  const firstUpdated = { ...firstTool, name: "First updated" };
  const secondUpdated = { ...secondTool, name: "Second updated" };
  let resolveStale!: (snapshot: WorkspaceSnapshot) => void;
  const staleRefresh = new Promise<WorkspaceSnapshot>((resolve) => { resolveStale = resolve; });
  let current = { ...snapshot, tools: [firstTool, secondTool] };
  const guard = createWorkspaceMutationGuard();
  const apply = (value: WorkspaceSnapshot) => { current = value; };

  const first = updateWorkspaceToolAndRefresh(
    workspaceApi({ patchTool: async () => firstUpdated, fetchSnapshot: async () => staleRefresh }),
    firstTool.id,
    { name: firstUpdated.name },
    () => current,
    apply,
    guard,
  );
  await Promise.resolve();
  const newerSnapshot = { ...snapshot, tools: [firstUpdated, secondUpdated] };
  await updateWorkspaceToolAndRefresh(
    workspaceApi({ patchTool: async () => secondUpdated, fetchSnapshot: async () => newerSnapshot }),
    secondTool.id,
    { name: secondUpdated.name },
    () => current,
    apply,
    guard,
  );
  resolveStale({
    ...snapshot,
    tools: [firstUpdated, secondTool],
  });
  await first;

  assert.deepEqual(current.tools.map((tool) => tool.name), [firstUpdated.name, secondUpdated.name]);
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
      () => snapshot,
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
      () => snapshot,
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

test("refreshes on focus only when the authoritative workspace is stale", async () => {
  const { shouldRefreshWorkspace } = await import("./useCustomTools.ts");
  assert.equal(shouldRefreshWorkspace(1_000, 20_000, 30_000), false);
  assert.equal(shouldRefreshWorkspace(1_000, 31_000, 30_000), true);
  assert.equal(shouldRefreshWorkspace(0, 1, 30_000), true);
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
