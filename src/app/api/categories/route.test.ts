import assert from "node:assert/strict";
import test from "node:test";

import { OwnerAuthorizationError } from "../../../lib/dashboard/owner-session.ts";
import { createCategoryPostHandler } from "./route.ts";

const category = { id: "category-1", name: "Research", sortOrder: 0 };
const request = (body: unknown) => new Request("http://localhost/api/categories", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("category POST rejects malformed category names with 400", async () => {
  const handler = createCategoryPostHandler({ authorize: async () => "owner@example.com", createCategory: async () => category });
  assert.equal((await handler(request({ name: 7 }))).status, 400);
  assert.equal((await handler(request({ name: "" }))).status, 400);
});

test("category POST safely maps authorization, configuration, and repository failures", async () => {
  for (const [error, status] of [[new OwnerAuthorizationError(401), 401], [new OwnerAuthorizationError(403), 403]] as const) {
    assert.equal((await createCategoryPostHandler({ authorize: async () => { throw error; }, createCategory: async () => category })(request({ name: "Research" }))).status, status);
  }
  for (const [name, status] of [["SupabaseConfigurationError", 503], ["Error", 502]] as const) {
    const error = new Error("owner@example.com secret https://project.supabase.co"); error.name = name;
    const response = await createCategoryPostHandler({ authorize: async () => "owner@example.com", createCategory: async () => { throw error; } })(request({ name: "Research" }));
    assert.equal(response.status, status);
    assert.equal(/owner@example\.com|project\.supabase\.co|secret/.test(await response.text()), false);
  }
});

test("category POST trims and returns the created category", async () => {
  const response = await createCategoryPostHandler({
    authorize: async () => "owner@example.com",
    createCategory: async (ownerEmail, name) => { assert.equal(ownerEmail, "owner@example.com"); assert.equal(name, "Research"); return category; },
  })(request({ name: " Research " }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { category });
});
