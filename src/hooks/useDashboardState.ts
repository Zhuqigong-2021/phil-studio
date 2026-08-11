"use client";

import { useCallback, useMemo, useState } from "react";
import {
  QA_IDS,
  WEEKDAYS,
  decorate,
} from "@/lib/dashboard/mock-data";
import type { DecoratedTool, PanelId, ViewMode } from "@/lib/dashboard/types";
import { buildCommandResults, buildToolResults, useShellState } from "./useShellState";
import { clearRecentTools } from "@/lib/dashboard/recent-tools";
import { formatRecentTime } from "@/lib/dashboard/recent-tools";
import { openTool } from "@/lib/dashboard/open-tool";
import { useDailyTasks } from "./useDailyTasks";
import { formatTaskTime } from "@/lib/dashboard/daily-tasks";
import { useCustomTools } from "./useCustomTools";

const FAV_BASE = "linear-gradient(165deg, rgba(165,180,255,.05) 0%, rgba(99,102,241,.035) 45%, rgba(15,26,60,.14) 100%)";

interface DragPayload {
  type: "panel" | "column";
  id?: PanelId;
  from?: "A" | "B";
}

export interface TagChip {
  name: string;
  active: boolean;
  onClick: () => void;
}

export interface PanelData {
  id: PanelId;
  dragStart: (e: React.DragEvent) => void;
  dragOver: (e: React.DragEvent) => void;
  drop: (e: React.DragEvent) => void;
}

export function useDashboardState() {
  const shell = useShellState();
  const { tasks: storedTasks, addTask, toggleTask } = useDailyTasks();
  const { tools: rawTools, categories, pinnedToolIds, recentTools: storedRecentTools, setToolFavorite } = useCustomTools();
  const { router, closePalette, query, openAddTool } = shell;
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");
  const [slots, setSlots] = useState<{ slotA: PanelId[]; slotB: PanelId[] }>({
    slotA: ["qa", "recent"],
    slotB: ["calendar", "todo"],
  });
  const { slotA, slotB } = slots;

  const removeFromSlots = useCallback(
    (a: PanelId[], b: PanelId[], id: PanelId) => ({
      slotA: a.filter((x) => x !== id),
      slotB: b.filter((x) => x !== id),
    }),
    [],
  );

  const movePanelBefore = useCallback(
    (dragId: PanelId, targetId: PanelId) => {
      if (dragId === targetId) return;
      setSlots((prev) => {
        const { slotA: a, slotB: b } = removeFromSlots(prev.slotA, prev.slotB, dragId);
        const inA = a.includes(targetId);
        const arr = (inA ? a : b).slice();
        let idx = arr.indexOf(targetId);
        if (idx === -1) idx = arr.length;
        arr.splice(idx, 0, dragId);
        return inA ? { slotA: arr, slotB: b } : { slotA: a, slotB: arr };
      });
    },
    [removeFromSlots],
  );

  const appendToSlot = useCallback(
    (dragId: PanelId, slotKey: "A" | "B") => {
      setSlots((prev) => {
        const { slotA: a, slotB: b } = removeFromSlots(prev.slotA, prev.slotB, dragId);
        return slotKey === "A" ? { slotA: [...a, dragId], slotB: b } : { slotA: a, slotB: [...b, dragId] };
      });
    },
    [removeFromSlots],
  );

  const swapSlots = useCallback(() => {
    setSlots((prev) => ({ slotA: prev.slotB, slotB: prev.slotA }));
  }, []);

  const handlePanelDrop = useCallback(
    (targetId: PanelId, e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      let data: DragPayload;
      try {
        data = JSON.parse(e.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      if (data.type === "panel" && data.id) movePanelBefore(data.id, targetId);
      else if (data.type === "column") swapSlots();
    },
    [movePanelBefore, swapSlots],
  );

  const handleSlotDrop = useCallback(
    (slotKey: "A" | "B", e: React.DragEvent) => {
      e.preventDefault();
      let data: DragPayload;
      try {
        data = JSON.parse(e.dataTransfer.getData("text/plain"));
      } catch {
        return;
      }
      if (data.type === "panel" && data.id) appendToSlot(data.id, slotKey);
      else if (data.type === "column" && data.from !== slotKey) swapSlots();
    },
    [appendToSlot, swapSlots],
  );

  const dragOverAllow = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const makePanelDragStart = useCallback(
    (id: PanelId) => (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: "panel", id }));
    },
    [],
  );
  const makeGripDragStart = useCallback(
    (slotKey: "A" | "B") => (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ type: "column", from: slotKey }),
      );
    },
    [],
  );

  const toggleFav = useCallback((id: string) => {
    const current = rawTools.find((tool) => tool.id === id)?.favorite ?? false;
    void setToolFavorite(id, !current).catch(() => undefined);
  }, [rawTools, setToolFavorite]);

  const tools: DecoratedTool[] = useMemo(() => {
    return rawTools.map(decorate);
  }, [rawTools]);

  const byId = useMemo(() => Object.fromEntries(tools.map((t) => [t.id, t])), [tools]);

  const allTools = useMemo(
    () => (activeTag ? tools.filter((t) => t.tags.includes(activeTag)) : tools),
    [tools, activeTag],
  );

  const favTools = useMemo(
    () =>
      tools
        .filter((t) => t.favorite)
        .map((t, i) => ({ ...t, favBg: FAV_BASE, isFirst: i === 0 })),
    [tools],
  );

  const qaTools = useMemo(() => {
    const ids = [...pinnedToolIds, ...storedRecentTools.map((entry) => entry.id), ...QA_IDS];
    return [...new Set(ids)].map((id) => byId[id]).filter(Boolean).slice(0, QA_IDS.length);
  }, [byId, pinnedToolIds, storedRecentTools]);

  const recentTools = useMemo(
    () =>
      storedRecentTools
        .map((entry) => ({ ...byId[entry.id], time: formatRecentTime(entry.openedAt) }))
        .filter((tool) => tool.id),
    [byId, storedRecentTools],
  );

  const tagsList: TagChip[] = useMemo(() => {
    const names = ["All", ...categories];
    return names.map((name) => ({
      name,
      active: name === "All" ? activeTag === null : name === activeTag,
      onClick: () => setActiveTag(name === "All" ? null : name),
    }));
  }, [activeTag, categories]);

  const todoTasks = useMemo(
    () =>
      storedTasks.map((task) => ({
        ...task,
        time: formatTaskTime(task.createdAt),
        toggle: () => toggleTask(task.id),
      })),
    [storedTasks, toggleTask],
  );

  const buildPanel = useCallback(
    (id: PanelId): PanelData => ({
      id,
      dragStart: makePanelDragStart(id),
      dragOver: dragOverAllow,
      drop: (e) => handlePanelDrop(id, e),
    }),
    [makePanelDragStart, dragOverAllow, handlePanelDrop],
  );

  const slotAPanels = useMemo(() => slotA.map(buildPanel), [slotA, buildPanel]);
  const slotBPanels = useMemo(() => slotB.map(buildPanel), [slotB, buildPanel]);
  const slotAEmpty = slotA.length === 0;
  const slotBEmpty = slotB.length === 0;

  const gridCols = `minmax(420px,1fr) ${
    slotAEmpty ? "minmax(56px,56px)" : "minmax(240px,280px)"
  } ${slotBEmpty ? "minmax(56px,56px)" : "minmax(300px,340px)"}`;

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

    // tools / tags
    tagsList,
    favTools,
    allTools,
    toggleFav,
    view,
    setView,

    // side panels
    qaTools,
    recentTools,
    clearRecentTools,
    weekdays: WEEKDAYS,
    todoTasks,
    addTask,
    slotA,
    slotB,
    slotAPanels,
    slotBPanels,
    slotAEmpty,
    slotBEmpty,
    gridCols,
    makeGripDragStart,
    handleSlotDrop,
    dragOverAllow,
  };
}

export type DashboardState = ReturnType<typeof useDashboardState>;
