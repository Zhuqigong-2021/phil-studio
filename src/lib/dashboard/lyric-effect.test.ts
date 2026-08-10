import assert from "node:assert/strict";
import test from "node:test";

import {
  LYRIC_EFFECT_MODE,
  usesBlurLyricLayer,
  usesParticleLyricLayer,
} from "./lyric-effect.ts";

test("uses the particle-to-blur handoff by default", () => {
  assert.equal(LYRIC_EFFECT_MODE, "hybrid");
  assert.equal(usesParticleLyricLayer(LYRIC_EFFECT_MODE), true);
  assert.equal(usesBlurLyricLayer(LYRIC_EFFECT_MODE), true);
});

test("keeps particle and blur as independent rollback modes", () => {
  assert.equal(usesParticleLyricLayer("particle"), true);
  assert.equal(usesBlurLyricLayer("particle"), false);
  assert.equal(usesParticleLyricLayer("blur"), false);
  assert.equal(usesBlurLyricLayer("blur"), true);
});
