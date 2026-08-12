import assert from "node:assert/strict";
import test from "node:test";

import { readLyricsPreference, writeLyricsPreference } from "./music-preferences.ts";

test("lyrics preference defaults off and persists explicit choices", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };

  assert.equal(readLyricsPreference(storage), false);
  writeLyricsPreference(storage, true);
  assert.equal(readLyricsPreference(storage), true);
  writeLyricsPreference(storage, false);
  assert.equal(readLyricsPreference(storage), false);
});

test("invalid or unavailable storage safely falls back to hidden lyrics", () => {
  assert.equal(readLyricsPreference(null), false);
  assert.equal(readLyricsPreference({ getItem: () => "unexpected", setItem: () => {} }), false);
  assert.equal(readLyricsPreference({ getItem: () => { throw new Error("blocked"); }, setItem: () => {} }), false);
});
