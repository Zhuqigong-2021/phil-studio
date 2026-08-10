import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync(
  new URL("../../app/dashboard/page.tsx", import.meta.url),
  "utf8",
);

test("play button invokes native playback inside the click callback", () => {
  assert.match(
    pageSource,
    /const togglePlay = React\.useCallback\([\s\S]*?audio\.play\(\)/,
  );
  assert.doesNotMatch(
    pageSource,
    /\}, \[isPlaying, currentIndex, audioRef\]\);/,
  );
});

test("React playback state follows real media events", () => {
  assert.match(pageSource, /addEventListener\("play", onPlay\)/);
  assert.match(pageSource, /addEventListener\("pause", onPause\)/);
  assert.match(pageSource, /removeEventListener\("play", onPlay\)/);
  assert.match(pageSource, /removeEventListener\("pause", onPause\)/);
});
