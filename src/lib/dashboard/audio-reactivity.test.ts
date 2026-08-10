import assert from "node:assert/strict";
import test from "node:test";

import {
  computeColumnMotionTargets,
  createAudioReactivityState,
  stepAudioReactivity,
} from "./audio-reactivity.ts";

function stepMany(
  state: ReturnType<typeof createAudioReactivityState>,
  frames: number,
  rawRms: number,
  rawBass: number,
  playing = true,
) {
  let next = state;
  for (let i = 0; i < frames; i += 1) {
    next = stepAudioReactivity(next, {
      rawRms,
      rawBass,
      dtMs: 16,
      playing,
    });
  }
  return next;
}

test("quiet steady input does not emit a beat", () => {
  const state = stepMany(createAudioReactivityState(), 120, 0.005, 0.03);

  assert.equal(state.beatPulse, 0);
});

test("a sudden bass rise emits one positive beat pulse", () => {
  const settled = stepMany(createAudioReactivityState(), 60, 0.04, 0.08);
  const hit = stepAudioReactivity(settled, {
    rawRms: 0.22,
    rawBass: 0.72,
    dtMs: 16,
    playing: true,
  });

  assert.ok(hit.beatPulse > 0.2);
  assert.ok(hit.cooldownMs > 0);
});

test("sustained bass does not retrigger during the refractory window", () => {
  const settled = stepMany(createAudioReactivityState(), 60, 0.04, 0.08);
  let state = stepAudioReactivity(settled, {
    rawRms: 0.22,
    rawBass: 0.72,
    dtMs: 16,
    playing: true,
  });
  let previousPulse = state.beatPulse;

  for (let i = 0; i < 10; i += 1) {
    state = stepAudioReactivity(state, {
      rawRms: 0.22,
      rawBass: 0.72,
      dtMs: 16,
      playing: true,
    });
    assert.ok(state.beatPulse <= previousPulse);
    previousPulse = state.beatPulse;
  }
});

test("larger RMS input produces larger smoothed loudness", () => {
  const low = stepMany(createAudioReactivityState(), 30, 0.04, 0.08);
  const high = stepMany(createAudioReactivityState(), 30, 0.24, 0.08);

  assert.ok(high.loudness > low.loudness + 0.3);
});

test("paused input decays loudness and clears beat activity", () => {
  let state = stepMany(createAudioReactivityState(), 30, 0.24, 0.7);
  state = stepMany(state, 90, 0, 0, false);

  assert.ok(state.loudness < 0.01);
  assert.equal(state.beatPulse, 0);
  assert.equal(state.cooldownMs, 0);
});

test("non-uniform spectrum keeps a clearly varied skyline at high loudness", () => {
  const bands = new Float32Array([
    0.9, 0.76, 0.68, 0.52, 0.38, 0.24, 0.18, 0.12, 0.1,
    0.08, 0.07, 0.06, 0.05, 0.04, 0.035, 0.03, 0.025, 0.02,
  ]);
  const targets = computeColumnMotionTargets(bands, 0.9, 0.7);
  const spread = Math.max(...targets.baseHeights) - Math.min(...targets.baseHeights);
  const impulseSpread =
    Math.max(...targets.beatImpulses) - Math.min(...targets.beatImpulses);

  assert.ok(Math.min(...targets.baseHeights) < 0.04);
  assert.ok(Math.max(...targets.baseHeights) > 0.28);
  assert.ok(spread > 0.24);
  assert.ok(Math.min(...targets.beatImpulses) < 0.04);
  assert.ok(Math.max(...targets.beatImpulses) > 0.4);
  assert.ok(impulseSpread > 0.36);
});
