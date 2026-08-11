"use client";

import { useMemo } from "react";
import { decorate } from "@/lib/dashboard/mock-data";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { useRecentTools } from "./useRecentTools";
import { formatRecentTime } from "@/lib/dashboard/recent-tools";
import { openTool } from "@/lib/dashboard/open-tool";
import { useCustomTools } from "./useCustomTools";

export function useRecentPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const { recentTools: storedRecentTools, clearRecentTools } = useRecentTools();
  const { tools: rawTools } = useCustomTools();

  const byId = useMemo(
    () => Object.fromEntries(rawTools.map(decorate).map((t) => [t.id, t])),
    [rawTools],
  );
  const recentTools = useMemo(
    () =>
      storedRecentTools
        .map((entry) => ({ ...byId[entry.id], time: formatRecentTime(entry.openedAt) }))
        .filter((tool) => tool.id),
    [storedRecentTools, byId],
  );

  const allTools = useMemo(() => Object.values(byId), [byId]);
  const q = query.trim().toLowerCase();
  const toolResults = useMemo(
    () =>
      buildToolResults(allTools, q, (t) => {
        openTool(t.id, t.url);
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
    clearRecent: clearRecentTools,
  };
}

export type RecentPageState = ReturnType<typeof useRecentPageState>;
