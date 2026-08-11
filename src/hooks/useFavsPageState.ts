"use client";

import { useMemo } from "react";
import { decorate } from "@/lib/dashboard/mock-data";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { openTool } from "@/lib/dashboard/open-tool";
import { useCustomTools } from "./useCustomTools";

export function useFavsPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const { tools: rawTools, setToolFavorite } = useCustomTools();

  const toggleFav = (id: string) => {
    const current = rawTools.find((tool) => tool.id === id)?.favorite ?? false;
    void setToolFavorite(id, !current).catch(() => undefined);
  };

  const tools = useMemo(
    () =>
      rawTools.map(decorate),
    [rawTools],
  );

  const favTools = useMemo(() => tools.filter((t) => t.favorite), [tools]);

  const q = query.trim().toLowerCase();
  const toolResults = useMemo(
    () =>
      buildToolResults(tools, q, (t) => {
        openTool(t.id, t.url);
        closePalette();
      }),
    [tools, q, closePalette],
  );
  const commandResults = useMemo(
    () => buildCommandResults(q, closePalette, router, openAddTool),
    [q, closePalette, router, openAddTool],
  );

  return {
    ...shell,
    toolResults,
    commandResults,
    favTools,
    toggleFav,
    favCount: favTools.length,
    hasFavs: favTools.length > 0,
  };
}

export type FavsPageState = ReturnType<typeof useFavsPageState>;
