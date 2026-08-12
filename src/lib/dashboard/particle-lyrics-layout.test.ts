import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(
  new URL("../../app/dashboard/dashboard.css", import.meta.url),
  "utf8",
);
const source = readFileSync(
  new URL("../../components/dashboard/SyncedLyrics.tsx", import.meta.url),
  "utf8",
);

test("gives the particle lyric canvas a measurable full-width parent", () => {
  assert.match(
    css,
    /\.synced-lyrics-line--current\s*\{[^}]*width:\s*100%/,
  );
});

test("overrides the official 240px particle minimum inside the lyric stage", () => {
  assert.match(
    css,
    /\.synced-lyrics-line\s+\.synced-lyrics-particle-text\s*\{[^}]*height:\s*28px[^}]*min-height:\s*0/,
  );
});

test("allows long lyric particles to shrink while preserving the 18px short-line size", () => {
  assert.match(source, /fontSize="18px"/);
  assert.match(source, /minFontSize=\{11\}/);
});
