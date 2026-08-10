import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("只对你有感觉 Remix points to its lyric timeline", () => {
  const track = TRACKS.find(
    (candidate) => candidate.title === "只对你有感觉 (Remix)",
  );

  assert.equal(track?.lyricsSlug, "只对你有感觉");
});

test("只对你有感觉 lyric API returns its complete timed text", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/only-feel-for-you"),
    { params: Promise.resolve({ slug: "只对你有感觉" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(payload.lines?.some((line) =>
    line.time === 27.69 && line.text === "无解的眼神心像海底针"
  ));
  assert.ok(payload.lines?.some((line) =>
    line.time === 76.85 && line.text === "全世界只对你有感觉"
  ));
  assert.equal(
    payload.lines?.some((line) => /^(?:男|女|合)：$/.test(line.text)),
    false,
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 221.79,
    text: "我只对你有感觉",
  });
});
