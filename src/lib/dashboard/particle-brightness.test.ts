import assert from "node:assert/strict";
import test from "node:test";

import {
  computeAirborneBrightness,
  computeLaunchBrightness,
  computeRestingBrightness,
  smoothBrightness,
} from "./particle-brightness.ts";

test("quiet playback keeps a visible brightness floor", () => {
  assert.equal(computeRestingBrightness(0, 0), 0.18);
});

test("global loudness and local band energy both increase brightness", () => {
  const quietStrongBand = computeRestingBrightness(0.15, 0.9);
  const loudWeakBand = computeRestingBrightness(0.85, 0.15);
  const loudStrongBand = computeRestingBrightness(0.85, 0.9);

  assert.ok(loudStrongBand > quietStrongBand);
  assert.ok(loudStrongBand > loudWeakBand + 0.2);
});

test("resting brightness remains capped at 85 percent", () => {
  assert.equal(computeRestingBrightness(1, 1), 0.85);
  assert.equal(computeRestingBrightness(4, 3), 0.85);
});

test("airborne launch emphasis ranges from 15 to 20 percent", () => {
  const base = 0.5;
  assert.ok(Math.abs(computeLaunchBrightness(base, 0) - 0.575) < 1e-9);
  assert.ok(Math.abs(computeLaunchBrightness(base, 1) - 0.6) < 1e-9);
  assert.equal(computeLaunchBrightness(0.8, 1), 0.85);
});

test("airborne brightness decays smoothly over particle lifetime", () => {
  const launch = computeAirborneBrightness(0.8, 0, 2);
  const middle = computeAirborneBrightness(0.8, 1, 2);
  const late = computeAirborneBrightness(0.8, 1.9, 2);

  assert.equal(launch, 0.8);
  assert.ok(middle < launch && middle > late);
  assert.ok(late > 0);
});

test("brightness smoothing attacks faster than it releases", () => {
  const attack = smoothBrightness(0.2, 0.8, 1 / 60);
  const release = smoothBrightness(0.8, 0.2, 1 / 60);

  assert.ok(attack - 0.2 > 0.8 - release);
});
