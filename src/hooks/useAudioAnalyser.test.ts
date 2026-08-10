import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./useAudioAnalyser.ts", import.meta.url),
  "utf8",
);

test("music analysis decodes real PCM without taking over native audio output", () => {
  assert.match(source, /OfflineAudioContext/);
  assert.match(source, /decodeAudioData/);
  assert.match(source, /audio\.currentTime/);
  assert.doesNotMatch(source, /new AudioContext|new AudioCtx/);
  assert.doesNotMatch(source, /createMediaElementSource/);
  assert.doesNotMatch(source, /createMediaStreamSource/);
  assert.doesNotMatch(source, /captureStream/);
});

test("keeps the visualizer contract with live decoded-audio refs", () => {
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
  assert.match(source, /writeDecodedAudioSpectrum/);
});
