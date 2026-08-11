import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMigrationPayload,
  toolRowToTool,
  validateToolPatch,
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

