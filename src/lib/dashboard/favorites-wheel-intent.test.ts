import assert from "node:assert/strict";
import test from "node:test";

import { accumulateWheelIntent } from "./favorites-wheel-intent.ts";

test("small same-direction deltas accumulate into one deliberate step", () => {
  let state = { direction: 0 as -1 | 0 | 1, distance: 0 };
  state = accumulateWheelIntent(state, 7, 24);
  state = accumulateWheelIntent(state, 9, 24);
  const result = accumulateWheelIntent(state, 10, 24);
  assert.equal(result.step, 1);
  assert.equal(result.distance, 0);
});

test("opposite momentum tail cannot reverse an active gesture", () => {
  const active = { direction: 1 as const, distance: 12 };
  const result = accumulateWheelIntent(active, -8, 24);
  assert.deepEqual(result, { direction: 1, distance: 12, step: 0 });
});

test("a fresh upward gesture produces an upward step", () => {
  const result = accumulateWheelIntent({ direction: 0, distance: 0 }, -30, 24);
  assert.equal(result.step, -1);
});

test("repeated reverse inertia never erodes the locked direction", () => {
  let state = { direction: 1 as const, distance: 0 };
  for (const delta of [-3, -8, -16, -28]) {
    const result = accumulateWheelIntent(state, delta, 24);
    assert.equal(result.step, 0);
    assert.equal(result.direction, 1);
    state = { direction: result.direction as 1, distance: result.distance };
  }
});
