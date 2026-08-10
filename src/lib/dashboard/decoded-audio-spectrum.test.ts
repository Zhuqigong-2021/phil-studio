import assert from "node:assert/strict";
import test from "node:test";

import { writeDecodedAudioSpectrum } from "./decoded-audio-spectrum.ts";

function sineWave(frequency: number, sampleRate = 44_100) {
  return Float32Array.from({ length: 4096 }, (_, index) =>
    Math.sin((2 * Math.PI * frequency * index) / sampleRate) * 0.8,
  );
}

test("decoded spectrum places bass and treble tones in different frequency bands", () => {
  const bass = new Float32Array(18);
  const treble = new Float32Array(18);

  const bassFrame = writeDecodedAudioSpectrum([sineWave(90)], 44_100, 1024, bass);
  const trebleFrame = writeDecodedAudioSpectrum([sineWave(5000)], 44_100, 1024, treble);

  assert.ok(bassFrame.bass > bassFrame.treble);
  assert.ok(trebleFrame.treble > trebleFrame.bass);
  assert.notEqual(bass.indexOf(Math.max(...bass)), treble.indexOf(Math.max(...treble)));
});

test("decoded spectrum reports the actual PCM loudness", () => {
  const quiet = sineWave(440).map((sample) => sample * 0.15);
  const loud = sineWave(440);

  const quietFrame = writeDecodedAudioSpectrum([quiet], 44_100, 1024, new Float32Array(18));
  const loudFrame = writeDecodedAudioSpectrum([loud], 44_100, 1024, new Float32Array(18));

  assert.ok(loudFrame.rms > quietFrame.rms * 5);
});
