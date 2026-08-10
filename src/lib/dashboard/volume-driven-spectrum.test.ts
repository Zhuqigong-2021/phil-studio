import assert from "node:assert/strict";
import test from "node:test";

import { writeVolumeDrivenSpectrum } from "./volume-driven-spectrum.ts";

test("volume-driven spectrum grows with the volume slider while playing", () => {
  const quiet = new Float32Array(18);
  const loud = new Float32Array(18);

  writeVolumeDrivenSpectrum(720, 0.2, true, quiet);
  writeVolumeDrivenSpectrum(720, 0.9, true, loud);

  const quietPeak = Math.max(...quiet);
  const loudPeak = Math.max(...loud);
  assert.ok(quietPeak > 0, "playing should keep a visible low-volume pulse");
  assert.ok(loudPeak > quietPeak * 2, "high volume should create a stronger pulse");
});

test("volume-driven spectrum is silent when paused or muted", () => {
  const paused = new Float32Array(18).fill(1);
  const muted = new Float32Array(18).fill(1);

  writeVolumeDrivenSpectrum(720, 0.8, false, paused);
  writeVolumeDrivenSpectrum(720, 0, true, muted);

  assert.deepEqual([...paused], new Array(18).fill(0));
  assert.deepEqual([...muted], new Array(18).fill(0));
});
