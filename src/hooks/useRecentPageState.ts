"use client";

import { useMemo, useState } from "react";
import { RECENT, TOOLS_RAW, decorate } from "@/lib/dashboard/mock-data";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";

export function useRecentPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const [cleared, setCleared] = useState(false);

  const byId = useMemo(() => Object.fromEntries(TOOLS_RAW.map(decorate).map((t) => [t.id, t])), []);
  const recentTools = useMemo(
    () => (cleared ? [] : RECENT.map((r) => ({ ...byId[r.id], time: r.time }))),
    [cleared, byId],
  );

  const allTools = useMemo(() => Object.values(byId), [byId]);
  const q = query.trim().toLowerCase();
  const toolResults = useMemo(
    () =>
      buildToolResults(allTools, q, (t) => {
        window.open(t.url ?? `https://${t.id}.example.com`, "_blank");
        closePalette();
      }),
    [allTools, q, closePalette],
  );
  const commandResults = useMemo(
    () => buildCommandResults(q, closePalette, router, openAddTool),
    [q, closePalette, router, openAddTool],
  );

  return {
    ...shell,
    toolResults,
    commandResults,
    recentTools,
    hasRecent: recentTools.length > 0,
    noRecent: recentTools.length === 0,
    clearRecent: () => setCleared(true),
  };
}

export type RecentPageState = ReturnType<typeof useRecentPageState>;
