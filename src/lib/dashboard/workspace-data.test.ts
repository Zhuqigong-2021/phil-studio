import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMigrationPayload,
  deleteWorkspaceToolRequest,
  toolRowToTool,
  validateToolPatch,
  WorkspaceSyncError,
} from "./workspace-data.ts";

const toolRow = {
  aliases: ["Docs", "Knowledge"],
  check_color: "#4ADE80",
  check_status: "Working",
  created_at: "2026-08-10T00:00:00.000Z",
  description: "Team notes",
  icon_color: "violet",
  icon_key: "notebook",
  icon_type: "matching",
  id: "tool-1",
  is_favorite: true,
  is_pinned: true,
  last_checked_at: "2026-08-10T01:00:00.000Z",
  last_used_at: "2026-08-10T02:00:00.000Z",
  mono: "NO",
  name: "Notes",
  owner_email: "owner@example.com",
  sort_order: 4,
  source_type: "external",
  updated_at: "2026-08-10T00:00:00.000Z",
  url: "https://example.com/notes",
  use_count: 3,
  visible: true,
} as const;

test("maps a database tool row and related category names to the current Tool contract", () => {
  assert.deepEqual(toolRowToTool(toolRow, ["Work", "Productivity"]), {
    id: "tool-1",
    name: "Notes",
    url: "https://example.com/notes",
    description: "Team notes",
    mono: "NO",
    accent: "violet",
    tags: ["Work", "Productivity"],
    favorite: true,
    sourceType: "external",
    iconKey: "notebook",
    iconType: "matching",
    aliases: ["Docs", "Knowledge"],
    checkStatus: "Working",
    checkColor: "#4ADE80",
    lastCheckedAt: "2026-08-10T01:00:00.000Z",
    visible: true,
    sortOrder: 4,
  });
});

test("rejects malformed or excessive aliases in a local migration", () => {
  const base = {
    tools: [{
      id: "custom-1",
      name: "Custom",
      url: "https://example.com",
      description: "",
      mono: "CU",
      accent: "blue",
      tags: [],
      aliases: ["Alias"],
      favorite: false,
      sourceType: "external",
      iconKey: "globe",
      iconType: "matching",
    }],
    categories: [],
    pinnedToolIds: [],
    favoriteOverrides: {},
    recentTools: [],
  };

  assert.throws(
    () => buildMigrationPayload({ ...base, tools: [{ ...base.tools[0], aliases: "Alias" }] }),
    /aliases/i,
  );
  assert.throws(
    () => buildMigrationPayload({
      ...base,
      tools: [{ ...base.tools[0], aliases: Array.from({ length: 11 }, (_, i) => `a${i}`) }],
    }),
    /at most 10 aliases/i,
  );
});

test("rejects invalid URLs and case-insensitive duplicate categories in a local migration", () => {
  const base = {
    tools: [{
      id: "custom-1",
      name: "Custom",
      url: "ftp://example.com",
      description: "",
      mono: "CU",
      accent: "blue",
      tags: [],
      aliases: [],
      favorite: false,
      sourceType: "external",
      iconKey: "globe",
      iconType: "matching",
    }],
    categories: [],
    pinnedToolIds: [],
    favoriteOverrides: {},
    recentTools: [],
  };

  assert.throws(() => buildMigrationPayload(base), /HTTP or HTTPS/i);
  assert.throws(
    () => buildMigrationPayload({ ...base, tools: [], categories: ["Work", " work "] }),
    /already exists/i,
  );
});

test("rejects patch keys outside the mutable tool allowlist", () => {
  assert.throws(() => validateToolPatch({ owner_email: "attacker@example.com" }), /unknown.*owner_email/i);
  assert.throws(() => validateToolPatch({ id: "replacement" }), /unknown.*id/i);
});

test("validates each supported scalar patch field independently", () => {
  const invalidPatches: Array<[Record<string, unknown>, RegExp]> = [
    [{ name: 123 }, /name.*string/i],
    [{ name: "   " }, /name.*required/i],
    [{ name: "x".repeat(61) }, /60 characters/i],
    [{ description: 123 }, /description.*string/i],
    [{ description: "x".repeat(161) }, /160 characters/i],
    [{ iconKey: 123 }, /icon key.*string/i],
    [{ accent: "invalid" }, /accent.*invalid/i],
    [{ sourceType: "invalid" }, /source.*invalid/i],
    [{ usedAt: 123 }, /usedAt.*string/i],
  ];

  for (const [patch, message] of invalidPatches) {
    assert.throws(
      () => validateToolPatch(patch),
      (error: unknown) => error instanceof Error && !(error instanceof TypeError) && message.test(error.message),
    );
  }

  assert.deepEqual(validateToolPatch({
    name: " Notes ", description: " Description ", iconKey: "notebook",
    accent: "teal", sourceType: "internal",
  }), {
    name: "Notes", description: "Description", iconKey: "notebook",
    accent: "teal", sourceType: "internal",
  });
});

test("sends encoded tool ids through DELETE and accepts an empty 204 response", async () => {
  let input = "";
  let method = "";
  await deleteWorkspaceToolRequest("mind map/2026", async (receivedInput, init) => {
    input = String(receivedInput);
    method = init?.method ?? "";
    return new Response(null, { status: 204 });
  });

  assert.equal(input, "/api/tools/mind%20map%2F2026");
  assert.equal(method, "DELETE");
});

test("propagates a parsed API error from tool deletion", async () => {
  await assert.rejects(
    () => deleteWorkspaceToolRequest("missing", async () => Response.json({ error: "Tool was not found." }, { status: 404 })),
    (error: unknown) => error instanceof WorkspaceSyncError && error.message === "Tool was not found.",
  );
});
