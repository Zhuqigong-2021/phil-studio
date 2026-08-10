import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Shape of You uses its official title and lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Shape of You");

  assert.equal(track?.artist, "Ed Sheeran");
  assert.equal(track?.lyricsSlug, "shapeofyou");
  assert.equal(
    TRACKS.some((candidate) => candidate.title === "Shape of U"),
    false,
  );
});

test("Shape of You lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/shapeofyou"),
    { params: Promise.resolve({ slug: "shapeofyou" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines?.[0], {
    time: 10,
    text: "The club isn’t the best place to find a lover",
  });
  assert.deepEqual(payload.lines?.at(-1), {
    time: 228,
    text: "I’m in love with the shape of you",
  });
});
