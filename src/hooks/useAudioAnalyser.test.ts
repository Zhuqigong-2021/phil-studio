import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./useAudioAnalyser.ts", import.meta.url),
  "utf8",
);

test("starts the Web Audio graph from an explicit user activation", () => {
  assert.match(
    source,
    /addEventListener\("pointerdown",\s*initializeAudioGraph/,
  );
  assert.match(
    source,
    /addEventListener\("keydown",\s*initializeAudioGraph/,
  );
  assert.match(source, /void ctx\.resume\(\)\.catch/);
});

test("removes pending activation listeners after initialization", () => {
  assert.match(
    source,
    /removeEventListener\("pointerdown",\s*initializeAudioGraph/,
  );
  assert.match(
    source,
    /removeEventListener\("keydown",\s*initializeAudioGraph/,
  );
});

test("keeps native audio output independent from Web Audio rendering", () => {
  assert.match(source, /captureStream\?\.\(\)/);
  assert.doesNotMatch(source, /createMediaElementSource/);
  assert.doesNotMatch(source, /analyser\.connect\(ctx\.destination\)/);
});
