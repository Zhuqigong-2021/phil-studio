import assert from "node:assert/strict";
import test from "node:test";

import {
  getLyricsProgressMotion,
  getLyricsStageMotion,
} from "./lyrics-progress-motion.ts";

test("lyrics progress preserves both approved positions with 400ms ease-in-out", () => {
  assert.deepEqual(getLyricsProgressMotion(false), {
    position: "relative",
    transform: "translateY(-5px)",
    transition: "transform 400ms ease-in-out",
  });
  assert.deepEqual(getLyricsProgressMotion(true), {
    position: "relative",
    transform: "translateY(10px)",
    transition: "transform 400ms ease-in-out",
  });
});

test("lyrics stage sits close above the lowered progress line", () => {
  assert.deepEqual(getLyricsStageMotion(), {
    transform: "translateY(8px)",
    justifyContent: "flex-start",
  });
});
