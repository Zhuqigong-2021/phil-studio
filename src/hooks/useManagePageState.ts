"use client";

import { useMemo, useState } from "react";
import { decorate } from "@/lib/dashboard/mock-data";
import type { DecoratedTool } from "@/lib/dashboard/types";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { useCustomTools } from "./useCustomTools";

export interface ManageRow extends DecoratedTool {
  starFill: string;
  toggleFav: () => void;
  toggleVisible: () => void;
  visBg: string;
  visDotLeft: string;
  rowBg: string;
  openEdit: () => void;
}

export interface EditingTool extends DecoratedTool {
  tagChips: string[];
  favDotLeft: string;
  visBg: string;
  visibleBg: string;
  visibleDotLeft: string;
  pinBg: string;
  pinDotLeft: string;
  toggleFav: () => void;
  toggleVisible: () => void;
  togglePin: () => void;
}

export function useManagePageState() {
  const shell = useShellState();
  const { router, closePalette, query, openAddTool } = shell;
  const [favOverrides, setFavOverrides] = useState<Record<string, boolean>>({});
  const [visOverrides, setVisOverrides] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const { tools: rawTools, pinnedToolIds, setToolPinned } = useCustomTools();

  const isFav = (id: string, base: boolean) => (favOverrides[id] !== undefined ? favOverrides[id] : base);
  const isVisible = (id: string) => (visOverrides[id] !== undefined ? visOverrides[id] : true);
  const isPinned = (id: string) => pinnedToolIds.includes(id);

  const toggleFav = (id: string, base: boolean) => setFavOverrides((prev) => ({ ...prev, [id]: !isFav(id, base) }));
  const toggleVis = (id: string) => setVisOverrides((prev) => ({ ...prev, [id]: !isVisible(id) }));
  const togglePin = (id: string) => setToolPinned(id, !isPinned(id));

  const manageTools: ManageRow[] = useMemo(
    () =>
      rawTools.map(decorate).map((t, i) => {
        const fav = isFav(t.id, t.favorite);
        const visible = isVisible(t.id);
        return {
          ...t,
          tagStr: t.tags.join(" · "),
          favorite: fav,
          starFill: fav ? "#67E8F9" : "none",
          toggleFav: () => toggleFav(t.id, t.favorite),
          toggleVisible: () => toggleVis(t.id),
          visBg: visible ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)",
          visDotLeft: visible ? "15px" : "2px",
          rowBg: i % 2 === 0 ? "rgba(15,26,60,.10)" : "rgba(15,26,60,.05)",
          openEdit: () => setEditingId(t.id),
        };
      }),
    [favOverrides, rawTools, visOverrides], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const editingTool: EditingTool | null = useMemo(() => {
    const raw = editingId ? rawTools.find((t) => t.id === editingId) : null;
    if (!raw) return null;
    const t = decorate(raw);
    const fav = isFav(t.id, t.favorite);
    const visible = isVisible(t.id);
    const pinned = isPinned(t.id);
    return {
      ...t,
      tagChips: t.tags,
      favorite: fav,
      toggleFav: () => toggleFav(t.id, t.favorite),
      favDotLeft: fav ? "15px" : "2px",
      visBg: fav ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)",
      toggleVisible: () => toggleVis(t.id),
      visibleBg: visible ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)",
      visibleDotLeft: visible ? "15px" : "2px",
      togglePin: () => togglePin(t.id),
      pinBg: pinned ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.12)",
      pinDotLeft: pinned ? "15px" : "2px",
    };
  }, [editingId, favOverrides, pinnedToolIds, rawTools, visOverrides]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = query.trim().toLowerCase();
  const toolResults = useMemo(
    () =>
      buildToolResults(manageTools, q, (t) => {
        setEditingId(t.id);
        closePalette();
      }),
    [manageTools, q, closePalette],
  );
  const commandResults = useMemo(
    () => buildCommandResults(q, closePalette, router, openAddTool),
    [q, closePalette, router, openAddTool],
  );

  return {
    ...shell,
    toolResults,
    commandResults,
    manageTools,
    hasEditing: !!editingTool,
    editingTool,
    closeEdit: () => setEditingId(null),
  };
}

export type ManagePageState = ReturnType<typeof useManagePageState>;
