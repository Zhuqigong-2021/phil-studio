import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./useAudioAnalyser.ts", import.meta.url),
  "utf8",
);

test("music analysis never instantiates Web Audio", () => {
  assert.doesNotMatch(source, /AudioContext/);
  assert.doesNotMatch(source, /createMediaElementSource/);
  assert.doesNotMatch(source, /createMediaStreamSource/);
  assert.doesNotMatch(source, /captureStream/);
});

test("keeps the visualizer contract with inert level refs", () => {
  for (const refName of [
    "bassRef",
    "midRef",
    "trebleRef",
    "energyRef",
    "loudnessRef",
    "beatPulseRef",
    "audioLevelRef",
    "bandsRef",
  ]) {
    assert.match(source, new RegExp(`\\b${refName}\\b`));
  }
});
