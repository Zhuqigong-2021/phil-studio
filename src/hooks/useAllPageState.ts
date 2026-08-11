"use client";

import { useMemo, useState } from "react";
import { decorate } from "@/lib/dashboard/mock-data";
import type { ViewMode } from "@/lib/dashboard/types";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import type { TagChip } from "./useDashboardState";
import { openTool } from "@/lib/dashboard/open-tool";
import { useCustomTools } from "./useCustomTools";

export function useAllPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const { tools: rawTools, categories, setToolFavorite } = useCustomTools();

  const toggleFav = (id: string) => {
    const current = rawTools.find((tool) => tool.id === id)?.favorite ?? false;
    void setToolFavorite(id, !current).catch(() => undefined);
  };

  const tools = useMemo(
    () =>
      rawTools.map(decorate),
    [rawTools],
  );

  const allTools = useMemo(
    () => (activeTag ? tools.filter((t) => t.tags.includes(activeTag)) : tools),
    [tools, activeTag],
  );

  const tagsList: TagChip[] = useMemo(() => {
    const names = ["All", ...categories];
    return names.map((name) => ({
      name,
      active: name === "All" ? activeTag === null : name === activeTag,
      onClick: () => setActiveTag(name === "All" ? null : name),
    }));
  }, [activeTag, categories]);

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
    () =>
      buildCommandResults(q, closePalette, router, openAddTool, [
        { name: "Grid", action: () => setView("grid") },
        { name: "List", action: () => setView("list") },
      ]),
    [q, closePalette, router, openAddTool],
  );

  return {
    ...shell,
    toolResults,
    commandResults,
    tagsList,
    allTools,
    toggleFav,
    view,
    setView,
    toolCount: allTools.length,
  };
}

export type AllPageState = ReturnType<typeof useAllPageState>;
