import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("七里香 points to its lyric timeline", () => {
  const track = TRACKS.find((candidate) => candidate.title === "七里香");

  assert.equal(track?.lyricsSlug, "七里香");
});

test("七里香 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/qi-li-xiang"),
    { params: Promise.resolve({ slug: "七里香" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 27.73 && line.text === "窗外的麻雀在电线杆上多嘴"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 264,
    text: "你是我唯一想要的了解",
  });
});
