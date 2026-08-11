import assert from "node:assert/strict";
import test from "node:test";

import { matchesToolQuery } from "./custom-tools.ts";
import { TOOLS_RAW } from "./mock-data.ts";

const EXPECTED_ALIAS_MATCHES = [
  ["ap", "art portfolio"],
  ["cv", "resume"],
  ["ps", "photoshop"],
  ["pdf", "pdf editor"],
  ["am", "video maker"],
  ["mm", "mind map"],
  ["sm", "exam prep"],
  ["no", "notes"],
  ["ai", "agent notes"],
] as const;

test("every built-in tool has a persisted alias that global search can match", () => {
  for (const [id, alias] of EXPECTED_ALIAS_MATCHES) {
    const tool = TOOLS_RAW.find((candidate) => candidate.id === id);
    assert.ok(tool, `missing built-in tool ${id}`);
    assert.ok(tool.aliases?.includes(alias), `${tool.name} is missing alias ${alias}`);
    assert.equal(matchesToolQuery(tool, alias), true);
  }
});
