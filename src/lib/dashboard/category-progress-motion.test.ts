import assert from "node:assert/strict";
import test from "node:test";

import { getCategoryProgressMotion, getCategoryProgressGradient } from "./category-progress-motion.ts";

test("category progress uses a restrained staggered ease-out reveal", () => {
  const first = getCategoryProgressMotion(0, false);
  const third = getCategoryProgressMotion(2, false);
  assert.equal(first.duration, 0.85);
  assert.equal(first.ease, "power3.out");
  assert.equal(first.delay, 0);
  assert.equal(third.delay, 0.09);
});

test("reduced motion presents final values immediately", () => {
  assert.deepEqual(getCategoryProgressMotion(3, true), {
    duration: 0,
    delay: 0,
    ease: "none",
  });
});

test("bar gradient ends in a lighter same-color highlight", () => {
  assert.equal(
    getCategoryProgressGradient("#9a70ff"),
    "linear-gradient(90deg, #9a70ff 0%, #9a70ff 68%, color-mix(in srgb, #9a70ff 88%, white) 82%, color-mix(in srgb, #9a70ff 68%, white) 100%)",
  );
});
