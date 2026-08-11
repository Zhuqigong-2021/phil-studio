import assert from "node:assert/strict";
import test from "node:test";

import {
  createManageTableState,
  manageTableReducer,
  runManageMutation,
} from "./manage-page-state.ts";
import type { Tool } from "../lib/dashboard/types.ts";

function tool(id: string, name = `Tool ${id}`): Tool {
  return {
    id,
    name,
    description: `${name} description`,
    mono: id.slice(0, 2).toUpperCase(),
    accent: "blue",
    tags: ["Work"],
    favorite: false,
    iconKey: "app-window",
    aliases: [],
    url: `https://example.com/${id}`,
  };
}

test("changing one row draft leaves every other row unchanged", () => {
  const initial = createManageTableState([tool("a"), tool("b")], []);
  const next = manageTableReducer(initial, {
    type: "draft/change",
    id: "a",
    partial: { name: "Edited A", favorite: true },
  });

  assert.equal(next.drafts.a.name, "Edited A");
  assert.equal(next.drafts.a.favorite, true);
  assert.deepEqual(next.drafts.b, initial.drafts.b);
  assert.notEqual(next.drafts.a, initial.drafts.a);
  assert.equal(next.drafts.b, initial.drafts.b);
});

test("a successful refresh resets only the matching draft from database state", () => {
  let state = createManageTableState([tool("a"), tool("b")], []);
  state = manageTableReducer(state, {
    type: "draft/change",
    id: "a",
    partial: { name: "Unsaved A" },
  });
  state = manageTableReducer(state, {
    type: "draft/change",
    id: "b",
    partial: { name: "Unsaved B" },
  });
  state = manageTableReducer(state, { type: "update/start", id: "a" });

  const refreshed = manageTableReducer(state, {
    type: "tools/sync",
    tools: [tool("a", "Saved A"), tool("b")],
    pinnedToolIds: ["a"],
    resetDraftIds: ["a"],
  });

  assert.equal(refreshed.drafts.a.name, "Saved A");
  assert.equal(refreshed.drafts.a.pinned, true);
  assert.equal(refreshed.drafts.b.name, "Unsaved B");
  assert.deepEqual(refreshed.updatingIds, []);
});

test("a failed update clears pending state but keeps the user's draft", () => {
  let state = createManageTableState([tool("a")], []);
  state = manageTableReducer(state, {
    type: "draft/change",
    id: "a",
    partial: { description: "Needs correction" },
  });
  state = manageTableReducer(state, { type: "update/start", id: "a" });
  state = manageTableReducer(state, { type: "update/failed", id: "a" });

  assert.equal(state.drafts.a.description, "Needs correction");
  assert.deepEqual(state.updatingIds, []);
});

test("changing page size returns pagination to page one", () => {
  let state = createManageTableState(Array.from({ length: 24 }, (_, index) => tool(String(index))), []);
  state = manageTableReducer(state, { type: "page/set", page: 3 });
  state = manageTableReducer(state, { type: "page-size/set", pageSize: 20 });

  assert.equal(state.page, 1);
  assert.equal(state.pageSize, 20);
});

test("a deletion refresh clamps the page to the nearest remaining page", () => {
  const tools = Array.from({ length: 11 }, (_, index) => tool(String(index)));
  let state = createManageTableState(tools, []);
  state = manageTableReducer(state, { type: "page/set", page: 2 });
  state = manageTableReducer(state, {
    type: "tools/sync",
    tools: tools.slice(0, 10),
    pinnedToolIds: [],
    resetDraftIds: [],
  });

  assert.equal(state.page, 1);
  assert.equal(state.pageSize, 10);
});

test("delete state remains cancellable until the request starts and actionable after failure", () => {
  let state = createManageTableState([tool("a")], []);
  state = manageTableReducer(state, { type: "delete/request", id: "a" });
  assert.equal(state.deleteTargetId, "a");
  assert.equal(state.deleting, false);

  state = manageTableReducer(state, { type: "delete/start" });
  state = manageTableReducer(state, { type: "delete/cancel" });
  assert.equal(state.deleteTargetId, "a");

  state = manageTableReducer(state, { type: "delete/failed" });
  assert.equal(state.deleteTargetId, "a");
  assert.equal(state.deleting, false);

  state = manageTableReducer(state, { type: "delete/cancel" });
  assert.equal(state.deleteTargetId, null);

  state = manageTableReducer(state, { type: "delete/request", id: "a" });
  state = manageTableReducer(state, { type: "delete/start" });
  state = manageTableReducer(state, { type: "delete/succeeded" });
  assert.equal(state.deleteTargetId, null);
  assert.equal(state.deleting, false);
});

test("publishes update success only after the database promise settles", async () => {
  let resolveMutation: (() => void) | undefined;
  const mutation = new Promise<void>((resolve) => { resolveMutation = resolve; });
  const published: { tone: string; message: string }[] = [];

  const request = runManageMutation({
    action: "updated",
    toolName: "Notion",
    mutate: () => mutation,
    publish: (toast) => { published.push(toast); },
  });

  assert.deepEqual(published, []);
  resolveMutation?.();
  assert.equal(await request, true);
  assert.deepEqual(published, [{ tone: "success", message: "Updated: Notion" }]);
});

test("publishes a mapped delete error only after the rejected request settles", async () => {
  const published: { tone: string; message: string }[] = [];
  const result = await runManageMutation({
    action: "deleted",
    toolName: "Notion",
    mutate: async () => { throw { status: 403 }; },
    publish: (toast) => { published.push(toast); },
  });

  assert.equal(result, false);
  assert.equal(published.length, 1);
  assert.equal(published[0].tone, "error");
  assert.match(published[0].message, /permission/i);
});
