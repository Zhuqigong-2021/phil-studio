import assert from "node:assert/strict";
import test from "node:test";

import {
  getLyricNeonColor,
  LYRIC_BLUR_KEYFRAMES,
  splitBlurText,
} from "./blur-text.ts";

test("splits Chinese lyrics into ordered characters and preserves spaces", () => {
  assert.deepEqual(splitBlurText("终于 了解"), ["终", "于", "\u00a0", "了", "解"]);
});

test("maps the lyric from indigo through sky and cyan to violet", () => {
  assert.equal(getLyricNeonColor(0, 5), "rgb(99 102 241)");
  assert.equal(getLyricNeonColor(1, 5), "rgb(56 189 248)");
  assert.equal(getLyricNeonColor(2, 5), "rgb(34 211 238)");
  assert.equal(getLyricNeonColor(3, 5), "rgb(129 140 248)");
  assert.equal(getLyricNeonColor(4, 5), "rgb(192 132 252)");
});

test("uses the approved three-stage blur-to-focus motion", () => {
  assert.deepEqual(LYRIC_BLUR_KEYFRAMES, {
    filter: ["blur(6px)", "blur(2px)", "blur(0px)"],
    opacity: [0, 0.55, 1],
    y: [6, 1, 0],
  });
});
