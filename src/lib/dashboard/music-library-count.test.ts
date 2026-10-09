import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { TRACKS } from "./music.ts";

const pageSource = readFileSync(
  new URL("../../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);

test("music library currently contains twenty-four tracks", () => {
  assert.equal(TRACKS.length, 24);
});

test("Favorite Music displays the live track count instead of a hardcoded value", () => {
  assert.match(pageSource, /value=\{String\(TRACKS\.length\)\}/);
  assert.doesNotMatch(pageSource, /value="40"\s+label="Favorite Music"/);
});
