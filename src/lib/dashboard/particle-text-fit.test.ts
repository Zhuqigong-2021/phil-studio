import assert from "node:assert/strict";
import test from "node:test";

import { fitParticleTextFontSize } from "./particle-text-fit.ts";

test("keeps the requested size when particle text already fits", () => {
  assert.equal(fitParticleTextFontSize(18, 180, 260, 11), 18);
});

test("shrinks long particle text below 18px while respecting its lyric minimum", () => {
  assert.equal(fitParticleTextFontSize(18, 390, 260, 11), 12);
  assert.equal(fitParticleTextFontSize(18, 600, 260, 11), 11);
});
