import assert from "node:assert/strict";
import test from "node:test";

import { OwnerAuthorizationError } from "../../../../lib/dashboard/owner-session.ts";
import { createWorkspaceMigrationPostHandler } from "./route.ts";

const snapshot = { tools: [], categories: [], pinnedToolIds: [], recentTools: [] };
const payload = { tools: [], categories: [], pinnedToolIds: [], favoriteOverrides: {}, recentTools: [] };
const request = (body: unknown) => new Request("http://localhost/api/workspace-data/migrate", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
});

test("migration POST rejects malformed JSON and invalid payloads with 400", async () => {
  const handler = createWorkspaceMigrationPostHandler({ authorize: async () => "owner@example.com", migrate: async () => snapshot });
  assert.equal((await handler(new Request("http://localhost", { method: "POST", body: "{" }))).status, 400);
  assert.equal((await handler(request({ tools: "bad" }))).status, 400);
});

test("migration POST safely maps authorization, configuration, and repository failures", async () => {
  for (const [error, status] of [
    [new OwnerAuthorizationError(401), 401], [new OwnerAuthorizationError(403), 403],
  ] as const) {
    const response = await createWorkspaceMigrationPostHandler({ authorize: async () => { throw error; }, migrate: async () => snapshot })(request(payload));
    assert.equal(response.status, status);
  }
  for (const [name, status] of [["SupabaseConfigurationError", 503], ["Error", 502]] as const) {
    const error = new Error("owner@example.com secret https://project.supabase.co"); error.name = name;
    const response = await createWorkspaceMigrationPostHandler({ authorize: async () => "owner@example.com", migrate: async () => { throw error; } })(request(payload));
    const body = await response.text();
    assert.equal(response.status, status);
    assert.equal(/owner@example\.com|project\.supabase\.co|secret/.test(body), false);
  }
});

test("migration POST validates once and returns the migrated snapshot", async () => {
  const response = await createWorkspaceMigrationPostHandler({
    authorize: async () => "owner@example.com",
    migrate: async (ownerEmail, received) => {
      assert.equal(ownerEmail, "owner@example.com");
      assert.deepEqual(received, payload);
      return snapshot;
    },
  })(request(payload));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), snapshot);
});

