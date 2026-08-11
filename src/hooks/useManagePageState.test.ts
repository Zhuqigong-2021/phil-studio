import assert from "node:assert/strict";
import test from "node:test";

import {
  createManageTableState,
  isManagePopoverOpen,
  manageTableReducer,
  parseManageAliasInput,
  runManageMutation,
  validateManageDraft,
} from "./manage-page-state.ts";
import { toolToRowDraft } from "../lib/dashboard/tool-library.ts";
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
  assert.deepEqual(next.dirtyIds, ["a"]);
});

test("authoritative tools replace untouched fallback drafts and pin values", () => {
  const fallback = tool("a", "Fallback A");
  const authoritative = tool("a", "Database A");
  const initial = createManageTableState([fallback], []);
  const synced = manageTableReducer(initial, {
    type: "tools/sync",
    tools: [authoritative],
    pinnedToolIds: ["a"],
    resetDraftIds: [],
  });

  assert.equal(synced.drafts.a.name, "Database A");
  assert.equal(synced.drafts.a.pinned, true);
  assert.equal(synced.aliasInputs.a, "");
});

test("authoritative refresh preserves dirty drafts and their active alias input", () => {
  let state = createManageTableState([tool("a", "Fallback A")], []);
  state = manageTableReducer(state, {
    type: "draft/change",
    id: "a",
    partial: { name: "Unsaved A" },
  });
  state = manageTableReducer(state, {
    type: "alias/change",
    id: "a",
    value: "Docs, docs, in progress",
  });
  const synced = manageTableReducer(state, {
    type: "tools/sync",
    tools: [{ ...tool("a", "Database A"), aliases: ["Database alias"] }],
    pinnedToolIds: ["a"],
    resetDraftIds: [],
  });

  assert.equal(synced.drafts.a.name, "Unsaved A");
  assert.equal(synced.aliasInputs.a, "Docs, docs, in progress");
  assert.deepEqual(synced.dirtyIds, ["a"]);
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
  state = manageTableReducer(state, { type: "alias/change", id: "a", value: "Unsaved alias, " });
  state = manageTableReducer(state, { type: "update/start", id: "a" });

  const refreshed = manageTableReducer(state, {
    type: "tools/sync",
    tools: [{ ...tool("a", "Saved A"), aliases: ["Saved alias"] }, tool("b")],
    pinnedToolIds: ["a"],
    resetDraftIds: ["a"],
  });

  assert.equal(refreshed.drafts.a.name, "Saved A");
  assert.equal(refreshed.drafts.a.pinned, true);
  assert.equal(refreshed.aliasInputs.a, "Saved alias");
  assert.equal(refreshed.drafts.b.name, "Unsaved B");
  assert.deepEqual(refreshed.updatingIds, []);
  assert.deepEqual(refreshed.dirtyIds, ["b"]);
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
  assert.deepEqual(state.dirtyIds, ["a"]);
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

test("strict alias parsing preserves duplicates so validation can reject them", () => {
  assert.deepEqual(parseManageAliasInput(" Docs, docs\nKnowledge "), ["Docs", "docs", "Knowledge"]);
});

test("complete row validation rejects invalid names, links, and duplicate aliases before mutation", () => {
  const base = toolToRowDraft(tool("a"), false);
  const cases = [
    { draft: { ...base, name: "   " }, aliases: "Docs", message: /name is required/i },
    { draft: { ...base, url: "ftp://example.com" }, aliases: "Docs", message: /HTTP or HTTPS/i },
    { draft: base, aliases: "Docs, docs", message: /duplicate alias/i },
  ];

  for (const sample of cases) {
    let mutationCalls = 0;
    assert.throws(() => {
      validateManageDraft(sample.draft, sample.aliases, ["Work"]);
      mutationCalls += 1;
    }, sample.message);
    assert.equal(mutationCalls, 0);
  }
});

test("complete row validation normalizes valid shared patch fields and rejects unknown categories", () => {
  const base = toolToRowDraft(tool("a"), false);
  assert.deepEqual(validateManageDraft(
    { ...base, name: "  Tool A  ", url: "example.com/a", color: "#22d3ee" },
    " Docs, Knowledge ",
    ["Work"],
  ), {
    iconKey: "app-window",
    accent: "#22D3EE",
    name: "Tool A",
    description: "Tool a description",
    tags: ["Work"],
    url: "https://example.com/a",
    pinned: false,
    favorite: false,
    aliases: ["Docs", "Knowledge"],
  });
  assert.throws(
    () => validateManageDraft({ ...base, tags: ["Invented"] }, "", ["Work"]),
    /category.*library/i,
  );
});

test("pending controls always close their popovers", () => {
  assert.equal(isManagePopoverOpen(true, false), true);
  assert.equal(isManagePopoverOpen(true, true), false);
  assert.equal(isManagePopoverOpen(false, true), false);
});
