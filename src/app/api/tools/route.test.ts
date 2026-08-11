import assert from "node:assert/strict";
import test from "node:test";

import { OwnerAuthorizationError } from "../../../lib/dashboard/owner-session.ts";
import { createToolPostHandler } from "./route.ts";

const draft = { name: "Docs", url: "example.com", description: "", iconKey: "book", accent: "blue" as const, tags: [], aliases: [], sourceType: "external" as const };
const tool = { id: "tool-1", name: "Docs", url: "https://example.com/", description: "", mono: "DO", accent: "blue" as const, tags: [], aliases: [], favorite: false, sourceType: "external" as const, iconKey: "book", iconType: "matching" as const };
const request = (body: unknown) => new Request("http://localhost/api/tools", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("tool POST rejects malformed bodies with 400", async () => {
  const handler = createToolPostHandler({ authorize: async () => "owner@example.com", createTool: async () => tool });
  assert.equal((await handler(request({ draft: { ...draft, name: 7 }, pin: false }))).status, 400);
  assert.equal((await handler(request({ draft, pin: "yes" }))).status, 400);
});

test("tool POST safely maps authorization, configuration, and repository failures", async () => {
  for (const [error, status] of [[new OwnerAuthorizationError(401), 401], [new OwnerAuthorizationError(403), 403]] as const) {
    assert.equal((await createToolPostHandler({ authorize: async () => { throw error; }, createTool: async () => tool })(request({ draft, pin: false }))).status, status);
  }
  for (const [name, status] of [["SupabaseConfigurationError", 503], ["Error", 502]] as const) {
    const error = new Error("owner@example.com secret https://project.supabase.co"); error.name = name;
    const response = await createToolPostHandler({ authorize: async () => "owner@example.com", createTool: async () => { throw error; } })(request({ draft, pin: false }));
    assert.equal(response.status, status);
    assert.equal(/owner@example\.com|project\.supabase\.co|secret/.test(await response.text()), false);
  }
});

test("tool POST returns the created tool", async () => {
  const response = await createToolPostHandler({
    authorize: async () => "owner@example.com",
    createTool: async (ownerEmail, receivedDraft, pin) => {
      assert.equal(ownerEmail, "owner@example.com");
      assert.deepEqual(receivedDraft, { ...draft, url: "https://example.com/" });
      assert.equal(pin, true);
      return tool;
    },
  })(request({ draft, pin: true }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { tool });
});
