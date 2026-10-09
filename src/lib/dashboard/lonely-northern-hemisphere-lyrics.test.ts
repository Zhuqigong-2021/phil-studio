import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { GET } from "../../app/api/lyrics/[slug]/route.ts";
import { TRACKS } from "./music.ts";

test("孤单北半球 is available with its audio, cover, and lyric timeline", async () => {
  const track = TRACKS.find((candidate) => candidate.title === "孤单北半球");

  assert.equal(track?.artist, "欧得洋");
  assert.equal(track?.src, encodeURI("/music/孤单北半球-欧得洋.mp3"));
  assert.equal(track?.cover, encodeURI("/music/covers/孤单北半球.png"));
  assert.equal(track?.lyricsSlug, "孤单北半球");
  assert.equal(
    existsSync(
      new URL("../../../public/music/孤单北半球-欧得洋.mp3", import.meta.url),
    ),
    true,
  );
  assert.equal(
    existsSync(
      new URL("../../../public/music/covers/孤单北半球.png", import.meta.url),
    ),
    true,
  );

  const response = await GET(
    new Request("http://localhost/api/lyrics/lonely-northern-hemisphere"),
    { params: Promise.resolve({ slug: "孤单北半球" }) },
  );
  const payload = (await response.json()) as {
    lines?: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.ok(
    payload.lines?.some(
      (line) => line.time === 17.12 && line.text === "用我的晚安陪你 吃早餐",
    ),
  );
  assert.deepEqual(payload.lines?.at(-1), {
    time: 214.53,
    text: "我的梦通通给你保管",
  });
});
