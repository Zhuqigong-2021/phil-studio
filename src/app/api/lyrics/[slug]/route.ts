import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  parseLoopingLyricText,
  parseLyricsTimeline,
} from "../../../../lib/dashboard/lyrics.ts";

const SAFE_SLUG = /^[\p{L}\p{N}-]+$/u;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!SAFE_SLUG.test(slug)) {
    return Response.json({ error: "Invalid lyric slug" }, { status: 400 });
  }

  const lyricPath = path.join(process.cwd(), "music", slug, `${slug}.txt`);

  try {
    const source = await readFile(lyricPath, "utf8");
    return Response.json({
      lines: parseLyricsTimeline(source),
      loopText: parseLoopingLyricText(source),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return Response.json({ error: "Lyrics not found" }, { status: 404 });
    }
    return Response.json({ error: "Unable to load lyrics" }, { status: 500 });
  }
}
