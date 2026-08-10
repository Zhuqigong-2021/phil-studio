import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("最好的安排 points to its lyric timeline", () => {
  const track = TRACKS.find(
    (candidate) => candidate.title === "最好的安排",
  );

  assert.equal(track?.lyricsSlug, "最好的安排");
});

test("最好的安排 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/best-arrangement"),
    { params: Promise.resolve({ slug: "最好的安排" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 0.84 && line.text === "他们说一切都是最好的安排"
  ));
  assert.deepEqual(payload.lines?.at(-1), {
    time: 233.69,
    text: "我还在等待那个最好的安排",
  });
});
