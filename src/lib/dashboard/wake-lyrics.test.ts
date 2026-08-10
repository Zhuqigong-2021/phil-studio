import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Wake track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Wake");

  assert.equal(track?.lyricsSlug, "Wake");
});

test("Wake lyric API returns its normalized English timeline", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/Wake"), {
    params: Promise.resolve({ slug: "Wake" }),
  });
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 14 && line.text === "At break of day"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 57,
    text: "Shining through me every day",
  });
});
