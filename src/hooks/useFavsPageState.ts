"use client";

import { useMemo, useState } from "react";
import { decorate } from "@/lib/dashboard/mock-data";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { openTool } from "@/lib/dashboard/open-tool";
import { useCustomTools } from "./useCustomTools";

export function useFavsPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const [favOverrides, setFavOverrides] = useState<Record<string, boolean>>({});
  const { tools: rawTools } = useCustomTools();

  const toggleFav = (id: string) => {
    setFavOverrides((prev) => {
      const base = rawTools.find((t) => t.id === id)?.favorite ?? false;
      const current = prev[id] !== undefined ? prev[id] : base;
      return { ...prev, [id]: !current };
    });
  };

  const tools = useMemo(
    () =>
      rawTools.map(decorate).map((t) => ({
        ...t,
        favorite: favOverrides[t.id] !== undefined ? favOverrides[t.id] : t.favorite,
      })),
    [favOverrides, rawTools],
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
