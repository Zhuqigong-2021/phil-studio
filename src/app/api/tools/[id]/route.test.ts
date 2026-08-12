import assert from "node:assert/strict";
import test from "node:test";

import { OwnerAuthorizationError } from "../../../../lib/dashboard/owner-session.ts";
import { WorkspaceToolNotFoundError } from "../../../../lib/dashboard/workspace-repository.ts";
import { createToolDeleteHandler, createToolPatchHandler } from "./route.ts";

const tool = { id: "tool-1", name: "Docs", mono: "DO", accent: "blue" as const, tags: [], favorite: true };
const request = (body: unknown) => new Request("http://localhost/api/tools/tool-1", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const context = { params: Promise.resolve({ id: "tool-1" }) };
const deleteRequest = new Request("http://localhost/api/tools/tool-1", { method: "DELETE" });

test("tool PATCH rejects malformed or forbidden fields with 400", async () => {
  const handler = createToolPatchHandler({ authorize: async () => "owner@example.com", patchTool: async () => tool });
  assert.equal((await handler(request({ favorite: "yes" }), context)).status, 400);
  assert.equal((await handler(request({ owner_email: "attacker@example.com" }), context)).status, 400);
});

test("tool PATCH safely maps authorization, configuration, and repository failures", async () => {
  for (const [error, status] of [[new OwnerAuthorizationError(401), 401], [new OwnerAuthorizationError(403), 403]] as const) {
    assert.equal((await createToolPatchHandler({ authorize: async () => { throw error; }, patchTool: async () => tool })(request({ favorite: true }), context)).status, status);
  }
  for (const [name, status] of [["SupabaseConfigurationError", 503], ["Error", 502]] as const) {
    const error = new Error("owner@example.com secret https://project.supabase.co"); error.name = name;
    const response = await createToolPatchHandler({ authorize: async () => "owner@example.com", patchTool: async () => { throw error; } })(request({ favorite: true }), context);
    assert.equal(response.status, status);
    assert.equal(/owner@example\.com|project\.supabase\.co|secret/.test(await response.text()), false);
  }
});

test("tool PATCH awaits Next.js 16 params and returns the updated tool", async () => {
  const response = await createToolPatchHandler({
    authorize: async () => "owner@example.com",
    patchTool: async (ownerEmail, id, patch) => {
      assert.equal(ownerEmail, "owner@example.com"); assert.equal(id, "tool-1"); assert.deepEqual(patch, { favorite: true }); return tool;
    },
  })(request({ favorite: true }), context);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { tool });
});

test("tool DELETE authorizes before deleting and returns an empty 204", async () => {
  const calls: string[] = [];
  const response = await createToolDeleteHandler({
    authorize: async () => { calls.push("authorize"); return "owner@example.com"; },
    deleteTool: async (ownerEmail, id) => { calls.push("delete"); assert.equal(ownerEmail, "owner@example.com"); assert.equal(id, "tool-1"); },
  })(deleteRequest, context);

  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
  assert.deepEqual(calls, ["authorize", "delete"]);
});

test("tool DELETE maps malformed or unknown ids to 404", async () => {
  const handler = createToolDeleteHandler({
    authorize: async () => "owner@example.com",
    deleteTool: async (_ownerEmail, id) => { throw new WorkspaceToolNotFoundError(id); },
  });

  assert.equal((await handler(deleteRequest, { params: Promise.resolve({ id: "" }) })).status, 404);
  assert.equal((await handler(deleteRequest, { params: Promise.resolve({ id: "missing" }) })).status, 404);
});

test("tool DELETE permits an owned seeded tool id", async () => {
  let deleteCalls = 0;
  const response = await createToolDeleteHandler({
    authorize: async () => "owner@example.com",
    deleteTool: async () => { deleteCalls += 1; },
  })(deleteRequest, { params: Promise.resolve({ id: "ap" }) });

  assert.equal(response.status, 204);
  assert.equal(deleteCalls, 1);
});

test("tool DELETE safely maps authorization, configuration, and repository failures", async () => {
  for (const [error, status] of [[new OwnerAuthorizationError(401), 401], [new OwnerAuthorizationError(403), 403]] as const) {
    assert.equal((await createToolDeleteHandler({ authorize: async () => { throw error; }, deleteTool: async () => undefined })(deleteRequest, context)).status, status);
  }
  for (const [name, status] of [["SupabaseConfigurationError", 503], ["Error", 502]] as const) {
    const error = new Error("owner@example.com secret https://project.supabase.co"); error.name = name;
    const response = await createToolDeleteHandler({ authorize: async () => "owner@example.com", deleteTool: async () => { throw error; } })(deleteRequest, context);
    assert.equal(response.status, status);
    assert.equal(/owner@example\.com|project\.supabase\.co|secret/.test(await response.text()), false);
  }
});
