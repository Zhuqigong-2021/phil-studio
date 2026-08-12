import assert from "node:assert/strict";
import test from "node:test";

import { getLyricLifecycle } from "./lyric-lifecycle.ts";

test("reserves the final part of a normal lyric for reverse blur", () => {
  assert.deepEqual(getLyricLifecycle(10, 14), {
    gatherDurationMs: 620,
    blurRevealDelayMs: 560,
    blurExitDelayMs: 3640,
    blurExitDurationMs: 360,
  });
});

test("compresses both transitions for a short lyric without overlap", () => {
  const lifecycle = getLyricLifecycle(10, 11.2);

  assert.ok(lifecycle.gatherDurationMs < 620);
  assert.ok(lifecycle.blurExitDurationMs < 360);
  assert.ok(lifecycle.blurExitDelayMs !== undefined);
  assert.equal(
    lifecycle.blurExitDelayMs + lifecycle.blurExitDurationMs,
    1200,
  );
  assert.ok(lifecycle.blurRevealDelayMs < lifecycle.blurExitDelayMs);
});

test("does not schedule reverse blur when the next lyric time is unavailable", () => {
  assert.equal(getLyricLifecycle(10, undefined).blurExitDelayMs, undefined);
});
