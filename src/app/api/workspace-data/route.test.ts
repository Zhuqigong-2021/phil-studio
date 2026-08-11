import assert from "node:assert/strict";
import test from "node:test";

import { OwnerAuthorizationError } from "../../../lib/dashboard/owner-session.ts";
import { createWorkspaceDataGetHandler } from "./route.ts";

const snapshot = { tools: [], categories: [], pinnedToolIds: [], recentTools: [] };

function configurationError() {
  const error = new Error("secret https://project.supabase.co");
  error.name = "SupabaseConfigurationError";
  return error;
}

test("GET maps authorization and server failures to safe responses", async () => {
  const cases = [
    { error: new OwnerAuthorizationError(401), status: 401 },
    { error: new OwnerAuthorizationError(403), status: 403 },
    { error: configurationError(), status: 503 },
    { error: new Error("owner@example.com secret https://project.supabase.co"), status: 502 },
  ];
  for (const { error, status } of cases) {
    const authorize = status <= 403 ? async () => { throw error; } : async () => "owner@example.com";
    const getSnapshot = status > 403 ? async () => { throw error; } : async () => snapshot;
    const response = await createWorkspaceDataGetHandler({ authorize, getSnapshot })();
    const body = await response.text();
    assert.equal(response.status, status);
    assert.equal(body.includes("owner@example.com"), false);
    assert.equal(body.includes("project.supabase.co"), false);
    assert.equal(body.includes("secret"), false);
  }
});

test("GET returns the owner workspace snapshot without caching", async () => {
  const response = await createWorkspaceDataGetHandler({
    authorize: async () => "owner@example.com",
    getSnapshot: async (ownerEmail) => {
      assert.equal(ownerEmail, "owner@example.com");
      return snapshot;
    },
  })();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), snapshot);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

