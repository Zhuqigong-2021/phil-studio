import assert from "node:assert/strict";
import test from "node:test";

import {
  BLUR_REVEAL_DELAY_MS,
  BLUR_REVEAL_DURATION_MS,
  PARTICLE_HANDOFF_DURATION_MS,
  getBlurHandoffStyle,
  getParticleHandoffStyle,
} from "./lyric-handoff.ts";

test("starts the final Blur Text before the particle layer has fully faded", () => {
  assert.ok(BLUR_REVEAL_DELAY_MS < PARTICLE_HANDOFF_DURATION_MS);
  assert.ok(
    BLUR_REVEAL_DELAY_MS + BLUR_REVEAL_DURATION_MS >=
      PARTICLE_HANDOFF_DURATION_MS,
  );
});

test("keeps both handoff animations in their final state", () => {
  assert.match(getParticleHandoffStyle().animation, /both$/);
  assert.match(getBlurHandoffStyle().animation, /both$/);
});

test("reverses Blur Text without bringing the particle layer back", () => {
  assert.doesNotMatch(getParticleHandoffStyle().animation, /return/);
  assert.match(
    getBlurHandoffStyle(3640, 360).animation,
    /lyric-blur-reverse-out[^,]*3640ms forwards/,
  );
});
