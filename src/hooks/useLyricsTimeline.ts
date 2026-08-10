"use client";

import React from "react";

import {
  buildLoopingLyricsTimeline,
  type LyricLine,
} from "@/lib/dashboard/lyrics";

export function useLyricsTimeline(
  slug: string | undefined,
  enabled: boolean,
  duration: number,
) {
  const [timeline, setTimeline] = React.useState<{
    slug: string;
    lines: LyricLine[];
    loopText?: string;
  } | null>(null);

  React.useEffect(() => {
    if (!slug || !enabled) return;

    const controller = new AbortController();

    async function loadLyrics() {
      try {
        const response = await fetch(`/api/lyrics/${encodeURIComponent(slug!)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as {
          lines?: LyricLine[];
          loopText?: string;
        };
        if (!controller.signal.aborted && Array.isArray(data.lines)) {
          setTimeline({
            slug: slug!,
            lines: data.lines,
            loopText: data.loopText,
          });
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setTimeline({ slug: slug!, lines: [] });
        }
      }
    }

    void loadLyrics();
    return () => controller.abort();
  }, [enabled, slug]);

  if (!enabled || !slug || timeline?.slug !== slug) return [];
  if (timeline.loopText) {
    return buildLoopingLyricsTimeline(timeline.loopText, duration);
  }
  return timeline.lines;
}
