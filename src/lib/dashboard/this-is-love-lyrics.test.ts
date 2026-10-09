import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("这，就是爱 is available with its audio, cover, and lyric timeline", async () => {
  const track = TRACKS.find((candidate) => candidate.title === "这，就是爱");

  assert.equal(track?.artist, "张杰");
  assert.equal(track?.src, encodeURI("/music/这就是爱-张杰.mp3"));
  assert.equal(track?.cover, encodeURI("/music/covers/这就是爱.png"));
  assert.equal(track?.lyricsSlug, "这就是爱");
  assert.equal(
    existsSync(
      new URL("../../../public/music/这就是爱-张杰.mp3", import.meta.url),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL("../../../public/music/covers/这就是爱.png", import.meta.url),
    ),
    true,
  );

  const response = await GET(
    new Request("http://localhost/api/lyrics/this-is-love"),
    { params: Promise.resolve({ slug: "这就是爱" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(
    payload.lines?.some(
      (line) => line.time === 15.98 && line.text.startsWith("和声：张杰"),
    ),
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 251.78,
    text: "这就是爱",
  });
});
