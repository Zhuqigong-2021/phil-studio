"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TAGS, TOOLS_RAW } from "@/lib/dashboard/mock-data";
import {
  CUSTOM_CATEGORIES_KEY,
  CUSTOM_TOOLS_CHANGED_EVENT,
  CUSTOM_TOOLS_KEY,
  PINNED_TOOLS_KEY,
  addCategoryToList,
  addPinnedToolId,
  appendCustomTool,
  createCustomTool,
  mergeCategories,
  parseStoredCategories,
  parseStoredToolIds,
  parseStoredTools,
  removePinnedToolId,
  type AddCategoryResult,
  type CustomToolDraft,
} from "@/lib/dashboard/custom-tools";
import type { Tool } from "@/lib/dashboard/types";

export function useCustomTools() {
  const [customTools, setCustomTools] = useState<Tool[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setCustomTools(parseStoredTools(window.localStorage.getItem(CUSTOM_TOOLS_KEY)));
    setCustomCategories(
      parseStoredCategories(window.localStorage.getItem(CUSTOM_CATEGORIES_KEY)),
    );
    setPinnedToolIds(parseStoredToolIds(window.localStorage.getItem(PINNED_TOOLS_KEY)));
  }, []);

  useEffect(() => {
    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener("storage", refresh);
    window.addEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  const notify = useCallback(() => {
    window.dispatchEvent(new Event(CUSTOM_TOOLS_CHANGED_EVENT));
  }, []);

  const addCategory = useCallback(
    (name: string): AddCategoryResult => {
      const merged = mergeCategories(TAGS, customCategories);
      const { category } = addCategoryToList(merged, name);
      const nextCustom = [...customCategories, category];
      window.localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(nextCustom));
      setCustomCategories(nextCustom);
      notify();
      return { categories: mergeCategories(TAGS, nextCustom), category };
    },
    [customCategories, notify],
  );

  const addTool = useCallback(
    (draft: CustomToolDraft, pin: boolean): Tool => {
      const tool = createCustomTool(draft, crypto.randomUUID());
      const nextTools = appendCustomTool(customTools, tool);
      const nextPinned = pin ? addPinnedToolId(pinnedToolIds, tool.id) : pinnedToolIds;
      window.localStorage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(nextTools));
      if (pin) window.localStorage.setItem(PINNED_TOOLS_KEY, JSON.stringify(nextPinned));
      setCustomTools(nextTools);
      if (pin) setPinnedToolIds(nextPinned);
      notify();
      return tool;
    },
    [customTools, notify, pinnedToolIds],
  );

  const setToolPinned = useCallback(
    (id: string, pinned: boolean) => {
      const next = pinned
        ? addPinnedToolId(pinnedToolIds, id)
        : removePinnedToolId(pinnedToolIds, id);
      window.localStorage.setItem(PINNED_TOOLS_KEY, JSON.stringify(next));
      setPinnedToolIds(next);
      notify();
    },
    [notify, pinnedToolIds],
  );

  const tools = useMemo(() => [...TOOLS_RAW, ...customTools], [customTools]);
  const categories = useMemo(
    () => mergeCategories(TAGS, customCategories),
    [customCategories],
  );

  return {
    tools,
    customTools,
    categories,
    pinnedToolIds,
    addCategory,
    addTool,
    setToolPinned,
  };
}
