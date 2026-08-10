import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("黄种人 points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "黄种人");

  assert.equal(track?.lyricsSlug, "黄种人");
});

test("黄种人 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/yellow-race"),
    { params: Promise.resolve({ slug: "黄种人" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 61.81 && line.text === "来自翻过五千里的浪"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 256.31,
    text: "看我如何做好汉",
  });
});
