import assert from "node:assert/strict";
import test from "node:test";

import {
  OwnerAuthorizationError,
  requireOwnerEmail,
} from "./owner-session.ts";

test("rejects a missing session with 401 without exposing session data", async () => {
  await assert.rejects(
    () => requireOwnerEmail(async () => null, "owner@example.com"),
    (error: unknown) => {
      assert.ok(error instanceof OwnerAuthorizationError);
      assert.equal(error.status, 401);
      assert.equal(error.message.includes("owner@example.com"), false);
      return true;
    },
  );
});

test("rejects a signed-in non-owner with 403 without exposing either email", async () => {
  await assert.rejects(
    () => requireOwnerEmail(
      async () => ({ user: { email: "intruder@example.com" } }),
      "owner@example.com",
    ),
    (error: unknown) => {
      assert.ok(error instanceof OwnerAuthorizationError);
      assert.equal(error.status, 403);
      assert.equal(error.message.includes("intruder@example.com"), false);
      assert.equal(error.message.includes("owner@example.com"), false);
      return true;
    },
  );
});

test("returns the normalized owner email for a mixed-case matching session", async () => {
  assert.equal(
    await requireOwnerEmail(
      async () => ({ user: { email: " Owner@Example.COM " } }),
      " owner@example.com ",
    ),
    "owner@example.com",
  );
});

