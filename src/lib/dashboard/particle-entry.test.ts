import assert from "node:assert/strict";
import test from "node:test";

import { getParticleEntryPosition } from "./particle-entry.ts";

test("V2 sends particles on the left and right inward from their matching sides", () => {
  const left = getParticleEntryPosition({
    pattern: "bilateral",
    targetX: 30,
    targetY: 20,
    width: 100,
    scatter: 40,
    seed: 0.3,
    depth: 0.8,
  });
  const right = getParticleEntryPosition({
    pattern: "bilateral",
    targetX: 70,
    targetY: 20,
    width: 100,
    scatter: 40,
    seed: 0.7,
    depth: 0.8,
  });

  assert.ok(left.x < 30);
  assert.ok(right.x > 70);
  assert.ok(Math.abs(left.y - 20) <= 8);
  assert.ok(Math.abs(right.y - 20) <= 8);
});

test("V1 retains the existing diagonal distribution", () => {
  const position = getParticleEntryPosition({
    pattern: "diagonal",
    targetX: 50,
    targetY: 20,
    width: 100,
    scatter: 40,
    seed: 0.25,
    depth: 0.8,
  });

  assert.notEqual(position.x, 50);
  assert.notEqual(position.y, 20);
});
