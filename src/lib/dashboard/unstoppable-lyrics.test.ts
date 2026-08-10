import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("Unstoppable track points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "Unstoppable");

  assert.equal(track?.lyricsSlug, "Unstoppable");
});

test("Unstoppable lyric API returns only the English timeline", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/Unstoppable"),
    { params: Promise.resolve({ slug: "Unstoppable" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 11.63 &&
    line.text === "I'll smile I know what it takes to fool this town"
  ));
  assert.equal(
    payload.lines?.some((line) => /[\p{Script=Han}]/u.test(line.text)),
    false,
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 206.87,
    text: "Unstoppable today I'm unstoppable today",
  });
});
