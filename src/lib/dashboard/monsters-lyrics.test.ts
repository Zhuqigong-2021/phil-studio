import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Monsters track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Monsters");

  assert.equal(track?.lyricsSlug, "Monsters");
});

test("Monsters lyric API returns its complete timed text", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/Monsters"), {
    params: Promise.resolve({ slug: "Monsters" }),
  });
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(payload.lines?.[0], {
    time: 0,
    text: "I see your monsters",
  });
  assert.deepEqual(payload.lines?.at(-1), {
    time: 218,
    text: "I'll stand there so brave and chase them all away",
  });
});
