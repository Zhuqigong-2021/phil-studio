import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "./route.ts";

test("rejects a lyric slug that could escape the music directory", async () => {
  const response = await GET(new Request("http://localhost/api/lyrics/unsafe"), {
    params: Promise.resolve({ slug: "../unsafe" }),
  });

  assert.equal(response.status, 400);
});

test("returns the parsed UTF-8 Ring Ring Ring timeline", async () => {
  const response = await GET(
    new Request("http://localhost/api/lyrics/ringringring"),
    { params: Promise.resolve({ slug: "ringringring" }) },
  );
  const body = (await response.json()) as {
    lines: Array<{ time: number; text: string }>;
  };

  assert.equal(response.status, 200);
  assert.deepEqual(body.lines[0], { time: 24, text: "终于了解等待滋味" });
  assert.ok(body.lines.length > 20);
});
