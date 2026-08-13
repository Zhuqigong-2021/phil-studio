import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateLighthouseEdgeHit,
  createLighthouseEdgeGeometry,
} from "./lighthouse-edge.ts";

test("createLighthouseEdgeGeometry caches rounded path and perimeter from a measured rect", () => {
  const geometry = createLighthouseEdgeGeometry({
    left: 100,
    top: 200,
    width: 300,
    height: 100,
  });

  assert.equal(geometry.radius, 16);
  assert.equal(geometry.perimeter, 800);
  assert.equal(
    geometry.pathData,
    "M 16 1 H 284 Q 299 1 299 16 V 84 Q 299 99 284 99 H 16 Q 1 99 1 84 V 16 Q 1 1 16 1 Z",
  );
});

test("calculateLighthouseEdgeHit returns the same local contact and beam footprint inputs", () => {
  const geometry = createLighthouseEdgeGeometry({
    left: 100,
    top: 100,
    width: 200,
    height: 100,
  });

  const hit = calculateLighthouseEdgeHit(geometry, { x: 0, y: 150 }, 0, 10);

  assert.ok(hit);
  assert.deepEqual(hit.localPoint, { x: 0, y: 50 });
  assert.equal(hit.fraction, 11 / 12);
  assert.equal(hit.distanceFromSource, 100);
  assert.equal(hit.beamFootprint, 76);
});

test("calculateLighthouseEdgeHit returns null when the beam misses the cached rect", () => {
  const geometry = createLighthouseEdgeGeometry({
    left: 100,
    top: 100,
    width: 200,
    height: 100,
  });

  assert.equal(calculateLighthouseEdgeHit(geometry, { x: 0, y: 0 }, 180, 10), null);
});
