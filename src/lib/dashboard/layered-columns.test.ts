import assert from "node:assert/strict";
import test from "node:test";
import {
  computeColumnParticleX,
  resamplePeakPreservingInto,
  resampleSpectrumInto,
} from "./layered-columns.ts";

test("peak-preserving 18-to-24 mapping retains local extrema", () => {
  const source = Float32Array.from(
    { length: 18 },
    (_, index) => (index % 2 === 0 ? 0.9 : 0.1),
  );
  const target = new Float32Array(24);
  resamplePeakPreservingInto(source, target);
  assert.ok(Math.max(...target) > 0.84);
  assert.ok(Math.min(...target) < 0.16);
});

test("18 analyser bands resample into 12 columns without dropping either edge", () => {
  const source = Float32Array.from({ length: 18 }, (_, index) => index);
  const target = new Float32Array(12);

  const result = resampleSpectrumInto(source, target);

  assert.equal(result, target);
  assert.equal(result.length, 12);
  assert.ok(Math.abs(result[0] - 1 / 3) < 1e-6);
  assert.ok(Math.abs(result[11] - 50 / 3) < 1e-6);
  for (let index = 1; index < result.length; index++) {
    assert.ok(result[index] > result[index - 1]);
  }
});

test("18-column display mode preserves every analyser value", () => {
  const source = Float32Array.from(
    { length: 18 },
    (_, index) => ((index * 7) % 19) / 19,
  );
  const target = new Float32Array(18);

  resampleSpectrumInto(source, target);

  assert.deepEqual([...target], [...source]);
});

test("18 analyser bands interpolate into 24 display columns without losing edges", () => {
  const input = Float32Array.from({ length: 18 }, (_, index) => index / 17);
  const output = new Float32Array(24);
  resampleSpectrumInto(input, output);
  assert.equal(output[0], 0);
  assert.equal(output[23], 1);
  for (let index = 1; index < output.length; index++) {
    assert.ok(output[index] > output[index - 1]);
  }
});

test("resting particle positions stay inside separated column bodies", () => {
  const columnCount = 12;
  const gapRatio = 0.16;
  const columnWidth = 1 / columnCount;
  const innerHalfWidth = (columnWidth * (1 - gapRatio)) / 2;

  for (let column = 0; column < columnCount; column++) {
    const center = (column + 0.5) * columnWidth;
    const left = computeColumnParticleX(column, columnCount, -0.5, gapRatio);
    const right = computeColumnParticleX(column, columnCount, 0.5, gapRatio);
    assert.ok(left >= center - innerHalfWidth - 1e-9);
    assert.ok(right <= center + innerHalfWidth + 1e-9);
    if (column < columnCount - 1) {
      const nextLeft = computeColumnParticleX(
        column + 1,
        columnCount,
        -0.5,
        gapRatio,
      );
      assert.ok(nextLeft - right >= columnWidth * gapRatio - 1e-9);
    }
  }
});
