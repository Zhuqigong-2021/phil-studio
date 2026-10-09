import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const proxySource = readFileSync(
  new URL("../../proxy.ts", import.meta.url),
  "utf8",
);

test("audio files and lyric endpoints require the existing app login", () => {
  assert.match(proxySource, /["']\/music\/:path\*["']/);
  assert.match(proxySource, /["']\/api\/lyrics\/:path\*["']/);
});
