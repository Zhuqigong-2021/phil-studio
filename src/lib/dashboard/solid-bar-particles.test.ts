import assert from "node:assert/strict";
import test from "node:test";

import {
  computeAttachedBounceLift,
  computeErosionGrainDelay,
  computeErosionNotchDepth,
  computeErosionTrailOffset,
  computeParticleReleaseDelay,
  computeParticleReleaseImpulse,
  computeNaturalClusterBudget,
  computeLowDebrisBudget,
  computeLowDebrisArc,
  computeDropletSpread,
  computeDropletTier,
  computeDropletTierImpulse,
  computeDropletTrailLag,
  computeTrailGrainBudget,
  computeTrailBrightness,
  computeTrailScale,
  computeRestrainedEmissionBudget,
  computeSurfaceGrainBudget,
  computeSurfaceGrainOffset,
  computeSurfaceGrainScale,
  computeStrongPrimaryBudget,
  computeStrongRootBudget,
  computeHighAccentBudget,
  computeTransitionClusterBudget,
  computeTransitionClusterLifetime,
  computeTransitionClusterOffset,
  writeSolidBarGeometry,
  type SolidBarGeometry,
} from "./solid-bar-particles.ts";

test("strong spray budgets stay inside the approved three-layer ranges", () => {
  assert.deepEqual(
    [0, 1, 4, 8, 12].map(computeStrongPrimaryBudget),
    [0, 8, 9, 11, 12],
  );
  assert.deepEqual(
    [0, 8, 9, 10, 11, 12].map(computeStrongRootBudget),
    [0, 16, 18, 19, 21, 22],
  );
  assert.deepEqual(
    [0, 0.45, 0.46, 0.72, 1].map(computeHighAccentBudget),
    [0, 0, 2, 3, 4],
  );
});

test("low debris completes a short arc back to its captured top", () => {
  assert.equal(computeLowDebrisArc(0, 0.24, 1), 0);
  assert.ok(computeLowDebrisArc(0.12, 0.24, 1) >= 0.0239);
  assert.equal(computeLowDebrisArc(0.24, 0.24, 1), 0);
});

test("natural launch cluster stays between ten and fourteen fragments", () => {
  assert.deepEqual(
    [0, 1, 2, 3, 4, 8].map(computeNaturalClusterBudget),
    [0, 10, 12, 14, 14, 14],
  );
});

test("roughly sixty percent of each cluster remains low debris", () => {
  assert.deepEqual(
    [10, 12, 14].map(computeLowDebrisBudget),
    [6, 7, 8],
  );
});

test("droplet clusters split into low, medium, and high tiers near 60/30/10", () => {
  for (const count of [10, 12, 14]) {
    const tiers = Array.from({ length: count }, (_, index) =>
      computeDropletTier(index, count),
    );
    assert.equal(tiers.filter((tier) => tier === 0).length, Math.round(count * 0.6));
    assert.equal(tiers.filter((tier) => tier === 2).length, Math.ceil(count * 0.1));
  }
});

test("droplet tiers gain progressively taller impulse and wider spread", () => {
  assert.ok(computeDropletTierImpulse(0, 0.8) < computeDropletTierImpulse(1, 0.8));
  assert.ok(computeDropletTierImpulse(1, 0.8) < computeDropletTierImpulse(2, 0.8));
  assert.ok(Math.abs(computeDropletSpread(0, 0.8, 1)) < Math.abs(computeDropletSpread(2, 0.8, 1)));
  assert.ok(computeDropletSpread(2, 0.8, 0) < 0);
  assert.ok(computeDropletSpread(2, 0.8, 1) > 0);
});

test("droplet tail lag grows non-linearly instead of forming equal dots", () => {
  const lags = [0, 1, 2, 3].map((rank) => computeDropletTrailLag(rank, 4));
  assert.ok(lags[1] - lags[0] > lags[0]);
  assert.ok(lags[2] - lags[1] > lags[1] - lags[0]);
  assert.ok(lags[3] - lags[2] > lags[2] - lags[1]);
});

test("primary particles receive two to four subordinate trail grains", () => {
  assert.deepEqual(
    [0, 0.5, 1].map(computeTrailGrainBudget),
    [2, 3, 4],
  );
});

test("trail grains shrink and darken monotonically behind their parent", () => {
  const scales = [0, 1, 2, 3].map((rank) => computeTrailScale(rank, 4));
  const brightness = [0, 1, 2, 3].map((rank) =>
    computeTrailBrightness(0.8, rank, 4),
  );
  for (let index = 1; index < 4; index++) {
    assert.ok(scales[index] < scales[index - 1]);
    assert.ok(brightness[index] < brightness[index - 1]);
  }
  assert.ok(brightness[3] > 0);
});

test("attached particle bounce rises from and returns to the bar top", () => {
  assert.equal(computeAttachedBounceLift(0, 0.08, 1), 0);
  assert.ok(computeAttachedBounceLift(0.04, 0.08, 1) >= 0.0139);
  assert.equal(computeAttachedBounceLift(0.08, 0.08, 1), 0);
  assert.ok(computeAttachedBounceLift(0.04, 0.08, 0) >= 0.0059);
});

test("particle releases are staggered from 40 to 80ms", () => {
  assert.equal(computeParticleReleaseDelay(0, 6), 0.04);
  assert.equal(computeParticleReleaseDelay(5, 6), 0.08);
  assert.ok(
    computeParticleReleaseDelay(2, 6) < computeParticleReleaseDelay(3, 6),
  );
});

test("early released particles receive the strongest upward impulse", () => {
  const early = computeParticleReleaseImpulse(0, 6, 0.8);
  const middle = computeParticleReleaseImpulse(3, 6, 0.8);
  const late = computeParticleReleaseImpulse(5, 6, 0.8);
  assert.ok(early > middle);
  assert.ok(middle > late);
  assert.ok(late > 0.35);
});

test("local erosion notch opens smoothly and fully recovers within 120ms", () => {
  assert.equal(computeErosionNotchDepth(0, 0.2), 0);
  assert.ok(computeErosionNotchDepth(0.06, 0.2) >= 0.0119);
  assert.equal(computeErosionNotchDepth(0.12, 0.2), 0);
  assert.ok(computeErosionNotchDepth(0.06, 0.006) <= 0.006);
});

test("erosion debris births are ordered and staggered over 60ms", () => {
  assert.equal(computeErosionGrainDelay(0, 6), 0);
  assert.equal(computeErosionGrainDelay(5, 6), 0.06);
  assert.ok(
    computeErosionGrainDelay(2, 6) < computeErosionGrainDelay(3, 6),
  );
  assert.equal(computeErosionGrainDelay(4, 1), 0);
});

test("erosion trail starts at the surface and advances upward continuously", () => {
  assert.equal(computeErosionTrailOffset(0, 0.2, 0.5), 0);
  const early = computeErosionTrailOffset(0.04, 0.2, 0.5);
  const middle = computeErosionTrailOffset(0.1, 0.2, 0.5);
  const late = computeErosionTrailOffset(0.16, 0.2, 0.5);
  assert.ok(early > 0);
  assert.ok(early < middle);
  assert.ok(middle < late);
  assert.ok(late < 0.04);
});

test("launch transition stays denser than the restrained airborne spray", () => {
  assert.deepEqual(
    [0, 1, 2, 4, 10].map(computeTransitionClusterBudget),
    [0, 6, 10, 18, 18],
  );
});

test("launch transition concentrates most seeds close to the bar top", () => {
  const lifetime = 0.14;
  const age = lifetime / 2;
  assert.equal(computeTransitionClusterOffset(age, lifetime, 0), 0);
  assert.ok(computeTransitionClusterOffset(age, lifetime, 0.25) < 0.002);
  assert.ok(computeTransitionClusterOffset(age, lifetime, 0.5) < 0.008);
  assert.ok(computeTransitionClusterOffset(age, lifetime, 1) >= 0.0279);
});

test("launch transition lifetime is brief and bounded", () => {
  assert.equal(computeTransitionClusterLifetime(0), 0.1);
  assert.equal(computeTransitionClusterLifetime(1), 0.18);
  assert.equal(computeTransitionClusterLifetime(-1), 0.1);
  assert.equal(computeTransitionClusterLifetime(2), 0.18);
});

test("airborne spray keeps the approved forty-percent restraint", () => {
  assert.deepEqual(
    [0, 1, 2, 5, 10].map(computeRestrainedEmissionBudget),
    [0, 1, 1, 2, 4],
  );
});

test("twenty-four solid bars stay inside separated column bodies", () => {
  const target: SolidBarGeometry = { x: 0, y: 0, width: 0, height: 0 };
  let previousRight = 0;

  for (let column = 0; column < 24; column++) {
    writeSolidBarGeometry(column, 24, 0.24, target);
    const left = target.x - target.width / 2;
    const right = target.x + target.width / 2;
    assert.ok(left >= previousRight - 1e-9);
    assert.ok(right <= (column + 1) / 24 + 1e-9);
    assert.equal(target.height, 0.24);
    assert.equal(target.y, 0.12);
    previousRight = right;
  }
});

test("zero-height bars remain collapsed on the baseline", () => {
  const target: SolidBarGeometry = { x: 0, y: 1, width: 0, height: 1 };
  writeSolidBarGeometry(3, 12, 0, target);
  assert.equal(target.height, 0);
  assert.equal(target.y, 0);
});

test("surface grain count remains small relative to airborne events", () => {
  assert.deepEqual(
    [0, 1, 2, 5, 10].map(computeSurfaceGrainBudget),
    [0, 2, 4, 8, 8],
  );
});

test("surface grain scale appears between invisible endpoints", () => {
  assert.equal(computeSurfaceGrainScale(0, 0.4), 0);
  assert.equal(computeSurfaceGrainScale(0.4, 0.4), 0);
  assert.ok(computeSurfaceGrainScale(0.2, 0.4) > 0.99);
});

test("surface grain midpoint remains close above the captured bar top", () => {
  assert.equal(computeSurfaceGrainOffset(0, 0.4, 1), 0);
  const low = computeSurfaceGrainOffset(0.2, 0.4, 0);
  const high = computeSurfaceGrainOffset(0.2, 0.4, 1);
  assert.ok(low >= 0.006 && low <= 0.006001);
  assert.ok(high >= 0.019999 && high <= 0.02);
});
