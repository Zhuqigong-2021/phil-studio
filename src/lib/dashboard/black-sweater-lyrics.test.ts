import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("黑色毛衣 points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "黑色毛衣");

  assert.equal(track?.lyricsSlug, "黑色毛衣");
});

test("黑色毛衣 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/black-sweater"),
    { params: Promise.resolve({ slug: "黑色毛衣" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 18.39 && line.text === "一件黑色毛衣 两个人的回忆"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 226.84,
    text: "就让回忆永远停在那里",
  });
});
