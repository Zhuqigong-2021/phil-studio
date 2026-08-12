import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layout = readFileSync("src/app/layout.tsx", "utf8");
const provider = readFileSync("src/components/dashboard/PersistentMusicProvider.tsx", "utf8");
const dashboard = readFileSync("src/app/dashboard/page.tsx", "utf8");

test("root layout owns the audio element so route changes cannot unmount playback", () => {
  assert.match(layout, /PersistentMusicProvider/);
  assert.match(provider, /<audio/);
  assert.doesNotMatch(dashboard, /<audio\s/);
});

test("dashboard consumes persistent playback and lyrics state", () => {
  assert.match(dashboard, /usePersistentMusic/);
  assert.match(provider, /showLyrics/);
  assert.match(provider, /writeLyricsPreference/);
});
