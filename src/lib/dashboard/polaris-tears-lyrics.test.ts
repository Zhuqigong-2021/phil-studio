import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("北极星的眼泪 track points to its lyric timeline", () => {
  const track = TRACKS.find(
    (candidate) => candidate.title === "北极星的眼泪",
  );

  assert.equal(track?.lyricsSlug, "北极星的眼泪");
});

test("北极星的眼泪 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/polaris-tears"),
    { params: Promise.resolve({ slug: "北极星的眼泪" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 11.23 && line.text === "像断了线消失人海里面"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 232.18,
    text: "整个宇宙都流眼泪",
  });
});
