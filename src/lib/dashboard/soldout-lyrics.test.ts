import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Sold Out track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Sold Out");

  assert.equal(track?.lyricsSlug, "Soldout");
});

test("Sold Out lyric API parses the bracketed timeline", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/Soldout"), {
    params: Promise.resolve({ slug: "Soldout" }),
  });
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 16.23 && line.text === "I ain't like no one you met before"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 205.31,
    text: "I am sold out",
  });
});
