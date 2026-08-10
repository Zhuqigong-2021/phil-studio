import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLoopingLyricsTimeline,
  findActiveLyricIndex,
  parseLoopingLyricText,
  parseLyricsTimeline,
  shouldShowLyricsAtTime,
} from "./lyrics.ts";

test("turns an untimed instrumental label into a four-second loop", () => {
  const text = parseLoopingLyricText("\nInstrumental\n");

  assert.equal(text, "Instrumental");
  assert.deepEqual(buildLoopingLyricsTimeline(text!, 10), [
    { time: 0, text: "Instrumental" },
    { time: 4, text: "Instrumental" },
    { time: 8, text: "Instrumental" },
  ]);
});

test("does not treat a timed lyric document as a looping label", () => {
  assert.equal(parseLoopingLyricText("0:00 first line"), undefined);
});

test("parses spaced and compact timestamps while ignoring blank or malformed lines", () => {
  const lines = parseLyricsTimeline(`
0:24 first line
0:27second line
not a lyric
1:02.5 third line
  `);

  assert.deepEqual(lines, [
    { time: 24, text: "first line" },
    { time: 27, text: "second line" },
    { time: 62.5, text: "third line" },
  ]);
});

test("parses bracketed LRC timestamps and ignores timestamp-only lines", () => {
  const lines = parseLyricsTimeline(`
[00:00.13]
[00:16.23]I ain't like no one you met before
[01:02.5]third line
  `);

  assert.deepEqual(lines, [
    { time: 16.23, text: "I ain't like no one you met before" },
    { time: 62.5, text: "third line" },
  ]);
});

test("hides lyrics exactly when the instrumental outro begins", () => {
  assert.equal(shouldShowLyricsAtTime(193.999, 194), true);
  assert.equal(shouldShowLyricsAtTime(194, 194), false);
  assert.equal(shouldShowLyricsAtTime(220, 194), false);
});

test("selects the latest lyric whose timestamp has been reached", () => {
  const lines = [
    { time: 24, text: "first" },
    { time: 27, text: "second" },
    { time: 33, text: "third" },
  ];

  assert.equal(findActiveLyricIndex(lines, 23.99), -1);
  assert.equal(findActiveLyricIndex(lines, 24), 0);
  assert.equal(findActiveLyricIndex(lines, 32.9), 1);
  assert.equal(findActiveLyricIndex(lines, 99), 2);
});
