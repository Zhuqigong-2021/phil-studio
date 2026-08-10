import assert from "node:assert/strict";
import test from "node:test";

import {
  ACTIVE_LYRIC_VERSION,
  getLyricVersionConfig,
} from "./lyric-version.ts";

test("preserves the current diagonal lyric presentation as V1", () => {
  assert.deepEqual(getLyricVersionConfig("v1"), {
    particleEntryPattern: "diagonal",
  });
});

test("restores the approved V1 lyric presentation", () => {
  assert.equal(ACTIVE_LYRIC_VERSION, "v1");
  assert.deepEqual(getLyricVersionConfig("v2"), {
    particleEntryPattern: "bilateral",
  });
});
