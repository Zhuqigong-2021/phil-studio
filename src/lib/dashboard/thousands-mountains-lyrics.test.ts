import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("千山万水 track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "千山万水");

  assert.equal(track?.lyricsSlug, "千山万水");
});

test("千山万水 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/thousands-mountains"),
    { params: Promise.resolve({ slug: "千山万水" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 20.71 && line.text === "千山万水 无数黑夜 等一轮明月"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 226.93,
    text: "远远抛开一切 过千山万水",
  });
});
