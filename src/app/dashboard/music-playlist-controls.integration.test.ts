import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("playlist view preserves volume controls and hides the left play-mode control", () => {
  assert.match(page, /<div[^>]*data-music-volume-controls/);
  assert.doesNotMatch(page, /\{!showList && \([\s\S]{0,80}<div[^>]*data-music-volume-controls/);
  assert.match(page, /\{!showList && \([\s\S]*?<button[\s\S]*?data-music-play-mode/);
  assert.match(page, /data-music-lyrics-toggle/);
  assert.match(page, /data-music-playlist-toggle/);
});
