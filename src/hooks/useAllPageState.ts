"use client";

import { useMemo, useState } from "react";
import { TAGS, TOOLS_RAW, decorate } from "@/lib/dashboard/mock-data";
import type { ViewMode } from "@/lib/dashboard/types";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import type { TagChip } from "./useDashboardState";
import { openTool } from "@/lib/dashboard/open-tool";

export function useAllPageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const [favOverrides, setFavOverrides] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string) => {
    setFavOverrides((prev) => {
      const base = TOOLS_RAW.find((t) => t.id === id)?.favorite ?? false;
      const current = prev[id] !== undefined ? prev[id] : base;
      return { ...prev, [id]: !current };
    });
  };

  const tools = useMemo(
    () =>
      TOOLS_RAW.map(decorate).map((t) => ({
        ...t,
        favorite: favOverrides[t.id] !== undefined ? favOverrides[t.id] : t.favorite,
      })),
    [favOverrides],
  );

  const allTools = useMemo(
    () => (activeTag ? tools.filter((t) => t.tags.includes(activeTag)) : tools),
    [tools, activeTag],
  );

  const tagsList: TagChip[] = useMemo(() => {
    const names = ["All", ...TAGS];
    return names.map((name) => ({
      name,
      active: name === "All" ? activeTag === null : name === activeTag,
      onClick: () => setActiveTag(name === "All" ? null : name),
    }));
  }, [activeTag]);

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
