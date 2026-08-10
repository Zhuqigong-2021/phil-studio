import assert from "node:assert/strict";
import test from "node:test";

import {
  computeFountainBedTargets,
  createFountainTriggerState,
  integrateFountainParticle,
  stepFountainTriggers,
  writeDetrendedBedTargets,
  writeDetrendedSpectrum,
  type FountainParticle,
} from "./fountain-physics.ts";

test("detrending preserves local peaks and valleys inside a descending spectrum", () => {
  const bands = new Float32Array([
    1, 0.82, 0.9, 0.68, 0.78, 0.57, 0.69, 0.49, 0.6,
    0.41, 0.51, 0.34, 0.43, 0.27, 0.36, 0.21, 0.29, 0.16,
  ]);
  const detail = new Float32Array(18);
  writeDetrendedSpectrum(bands, detail);
  let reversals = 0;
  let previousDirection = 0;
  for (let index = 1; index < detail.length; index++) {
    const direction = Math.sign(detail[index] - detail[index - 1]);
    if (direction !== 0 && previousDirection !== 0 && direction !== previousDirection) {
      reversals++;
    }
    if (direction !== 0) previousDirection = direction;
  }
  assert.ok(reversals >= 8);
  assert.ok(Math.abs(detail[0] - detail[17]) < 0.45);
});

test("detrending does not invent variation for genuinely equal input", () => {
  const bands = new Float32Array(8).fill(0.4);
  const detail = new Float32Array(8);
  writeDetrendedSpectrum(bands, detail);
  assert.ok(Math.max(...detail) - Math.min(...detail) < 0.0001);
});

test("direct detrended bed targets remain bounded and respond to local detail", () => {
  const detail = new Float32Array([0.2, 0.85, 0.25]);
  const raw = new Float32Array([0.4, 0.7, 0.35]);
  const onsets = new Float32Array([0, 0.5, 0]);
  const target = new Float32Array(3);
  writeDetrendedBedTargets(detail, raw, onsets, 0.75, target);
  assert.ok(target[1] > target[0] + 0.1);
  assert.ok(target[1] <= 0.38);
  assert.ok(target[0] >= 0.04);
});

test("quiet music retains visible contour when real spectral variance exists", () => {
  const detail = new Float32Array([0.18, 0.82, 0.24, 0.76, 0.2]);
  const raw = new Float32Array([0.42, 0.48, 0.4, 0.46, 0.41]);
  const onsets = new Float32Array(5);
  const target = new Float32Array(5);
  writeDetrendedBedTargets(detail, raw, onsets, 0.12, target);
  assert.ok(Math.max(...target) - Math.min(...target) >= 0.08);
});

test("dynamic contour does not fabricate variation for flat input", () => {
  const detail = new Float32Array(6).fill(0.5);
  const raw = new Float32Array(6).fill(0.4);
  const onsets = new Float32Array(6);
  const target = new Float32Array(6);
  writeDetrendedBedTargets(detail, raw, onsets, 0.3, target);
  assert.ok(Math.max(...target) - Math.min(...target) < 0.0001);
});

test("loudness raises the contour baseline and available range", () => {
  const detail = new Float32Array([0.2, 0.8, 0.25, 0.75]);
  const raw = new Float32Array([0.4, 0.5, 0.42, 0.48]);
  const onsets = new Float32Array(4);
  const quiet = new Float32Array(4);
  const loud = new Float32Array(4);
  writeDetrendedBedTargets(detail, raw, onsets, 0.15, quiet);
  writeDetrendedBedTargets(detail, raw, onsets, 0.85, loud);
  const quietMean = quiet.reduce((sum, value) => sum + value, 0) / quiet.length;
  const loudMean = loud.reduce((sum, value) => sum + value, 0) / loud.length;
  assert.ok(loudMean > quietMean + 0.05);
  assert.ok(Math.max(...loud) - Math.min(...loud) > Math.max(...quiet) - Math.min(...quiet));
});

const steadyBands = () => new Float32Array([0.12, 0.2, 0.16, 0.1]);

test("continuous sand bed grows with loudness and preserves spectral peaks", () => {
  const bands = new Float32Array([0.05, 0.12, 0.9, 0.16, 0.08]);
  const quiet = computeFountainBedTargets(bands, 0.12);
  const loud = computeFountainBedTargets(bands, 0.85);
  const loudMax = Math.max(...loud);
  const loudMin = Math.min(...loud);

  assert.ok(Math.min(...quiet) > 0.055);
  assert.ok(loudMax > Math.max(...quiet) + 0.16);
  assert.ok(loudMax > 0.32);
  assert.ok(loudMax - loudMin > 0.2);
  assert.ok(loud[2] > loud[0] * 2.8);
});

test("steady spectrum does not create autonomous fountain bursts", () => {
  let state = createFountainTriggerState(4);
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.5,
    beatPulse: 0,
    playing: true,
  });
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.5,
    beatPulse: 0,
    playing: true,
  });

  assert.equal(state.primaryBurst, 0);
  assert.deepEqual([...state.onsetStrengths], [0, 0, 0, 0]);
  assert.equal(state.emissionBudget, 0);
});

test("one beat rising edge creates one primary burst without decay retriggers", () => {
  let state = createFountainTriggerState(4);
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.7,
    beatPulse: 0,
    playing: true,
  });
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.7,
    beatPulse: 0.82,
    playing: true,
  });
  const burstBudget = state.emissionBudget;

  assert.ok(state.primaryBurst > 0.7);
  assert.ok(burstBudget >= 12);

  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.7,
    beatPulse: 0.65,
    playing: true,
  });
  assert.equal(state.primaryBurst, 0);
  assert.equal(state.emissionBudget, 0);
});

test("a measured band onset creates a smaller accent at that position", () => {
  let state = createFountainTriggerState(4);
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.55,
    beatPulse: 0,
    playing: true,
  });
  state = stepFountainTriggers(state, {
    bands: new Float32Array([0.12, 0.2, 0.72, 0.1]),
    loudness: 0.55,
    beatPulse: 0,
    playing: true,
  });

  assert.equal(state.primaryBurst, 0);
  assert.ok(state.onsetStrengths[2] > 0.5);
  assert.equal(state.onsetStrengths[0], 0);
  assert.ok(state.emissionBudget > 0 && state.emissionBudget < 12);
});

test("one sustained band rise emits one accent instead of retriggering every frame", () => {
  let state = createFountainTriggerState(4);
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.55,
    beatPulse: 0,
    playing: true,
  });
  const raisedBands = new Float32Array([0.12, 0.2, 0.72, 0.1]);
  state = stepFountainTriggers(state, {
    bands: raisedBands,
    loudness: 0.55,
    beatPulse: 0,
    playing: true,
  });
  assert.ok(state.emissionBudget > 0);

  for (let frame = 0; frame < 8; frame += 1) {
    state = stepFountainTriggers(state, {
      bands: raisedBands,
      loudness: 0.55,
      beatPulse: 0,
      playing: true,
    });
    assert.equal(state.emissionBudget, 0);
    assert.equal(state.onsetStrengths[2], 0);
  }
});

test("pause suppresses every new emission", () => {
  let state = createFountainTriggerState(4);
  state = stepFountainTriggers(state, {
    bands: steadyBands(),
    loudness: 0.5,
    beatPulse: 0,
    playing: true,
  });
  state = stepFountainTriggers(state, {
    bands: new Float32Array([0.9, 0.9, 0.9, 0.9]),
    loudness: 1,
    beatPulse: 1,
    playing: false,
  });

  assert.equal(state.primaryBurst, 0);
  assert.equal(state.emissionBudget, 0);
  assert.deepEqual([...state.onsetStrengths], [0, 0, 0, 0]);
});

test("ballistic grain rises, reaches an apex, and descends under gravity", () => {
  let particle: FountainParticle = {
    active: true,
    x: 0.49,
    y: 0,
    vx: 0.08,
    vy: 0.9,
    gravity: 1.8,
    age: 0,
    lifetime: 2,
  };
  let sawPositiveVelocity = false;
  let sawNegativeVelocity = false;

  for (let i = 0; i < 50; i += 1) {
    particle = integrateFountainParticle(particle, 0.02);
    sawPositiveVelocity ||= particle.vy > 0;
    sawNegativeVelocity ||= particle.vy < 0;
  }

  assert.equal(sawPositiveVelocity, true);
  assert.equal(sawNegativeVelocity, true);
  assert.ok(particle.x > 0.5);
  assert.ok(particle.x <= 1);
});

test("water droplet loses horizontal speed to light air drag", () => {
  const particle = integrateFountainParticle(
    {
      active: true,
      x: 0.4,
      y: 0.2,
      vx: 0.2,
      vy: 0.7,
      gravity: 1.8,
      age: 0,
      lifetime: 2,
    },
    0.1,
  );

  assert.ok(particle.vx > 0);
  assert.ok(particle.vx < 0.2);
});

test("descending grain returns to the pool at the baseline", () => {
  const particle = integrateFountainParticle(
    {
      active: true,
      x: 0.5,
      y: 0.002,
      vx: 0,
      vy: -0.2,
      gravity: 1.8,
      age: 0.5,
      lifetime: 2,
    },
    0.02,
  );

  assert.equal(particle.active, false);
  assert.equal(particle.y, 0);
});
