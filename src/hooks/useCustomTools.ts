"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CUSTOM_CATEGORIES_KEY,
  CUSTOM_TOOLS_CHANGED_EVENT,
  CUSTOM_TOOLS_KEY,
  PINNED_TOOLS_KEY,
  mergeCategories,
  parseStoredCategories,
  parseStoredToolIds,
  parseStoredTools,
  type AddCategoryResult,
  type CustomToolDraft,
} from "../lib/dashboard/custom-tools.ts";
import { FAVORITES_STORAGE_KEY } from "../lib/dashboard/favorites.ts";
import { TAGS, TOOLS_RAW } from "../lib/dashboard/mock-data.ts";
import { parseStoredRecentTools, RECENT_TOOLS_STORAGE_KEY } from "../lib/dashboard/recent-tools.ts";
import {
  buildMigrationPayload,
  fetchWorkspaceSnapshot,
  migrateWorkspaceSnapshot,
  patchWorkspaceTool,
  postWorkspaceCategory,
  postWorkspaceTool,
  type CategoryRecord,
  type LocalMigrationPayload,
  type ToolPatch,
  type WorkspaceSnapshot,
} from "../lib/dashboard/workspace-data.ts";
import type { Tool } from "../lib/dashboard/types.ts";

export const SUPABASE_MIGRATED_KEY = "phil-studio:supabase-migrated:v1";

export interface WorkspaceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface WorkspaceApi {
  fetchSnapshot(): Promise<WorkspaceSnapshot>;
  migrate(payload: LocalMigrationPayload): Promise<WorkspaceSnapshot>;
  postTool(draft: CustomToolDraft, pin: boolean): Promise<Tool>;
  postCategory(name: string): Promise<CategoryRecord>;
  patchTool(id: string, patch: ToolPatch): Promise<Tool>;
}

const DEFAULT_WORKSPACE_API: WorkspaceApi = {
  fetchSnapshot: fetchWorkspaceSnapshot,
  migrate: migrateWorkspaceSnapshot,
  postTool: postWorkspaceTool,
  postCategory: postWorkspaceCategory,
  patchTool: patchWorkspaceTool,
};

const BUILT_IN_IDS = new Set(TOOLS_RAW.map((tool) => tool.id));
const DEFAULT_CATEGORY_KEYS = new Set(TAGS.map((tag) => tag.toLocaleLowerCase()));

function parseFavoriteOverrides(raw: string | null): Record<string, boolean> {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"),
    );
  } catch {
    return {};
  }
}

function migrationPayloadFromStorage(storage: WorkspaceStorage): LocalMigrationPayload {
  return buildMigrationPayload({
    tools: parseStoredTools(storage.getItem(CUSTOM_TOOLS_KEY)),
    categories: parseStoredCategories(storage.getItem(CUSTOM_CATEGORIES_KEY)),
    pinnedToolIds: parseStoredToolIds(storage.getItem(PINNED_TOOLS_KEY)),
    favoriteOverrides: parseFavoriteOverrides(storage.getItem(FAVORITES_STORAGE_KEY)),
    recentTools: parseStoredRecentTools(storage.getItem(RECENT_TOOLS_STORAGE_KEY)),
  });
}

export function readCachedWorkspace(storage: WorkspaceStorage): WorkspaceSnapshot {
  const favoriteOverrides = parseFavoriteOverrides(storage.getItem(FAVORITES_STORAGE_KEY));
  const tools = [...TOOLS_RAW, ...parseStoredTools(storage.getItem(CUSTOM_TOOLS_KEY))]
    .map((tool) => ({ ...tool, favorite: favoriteOverrides[tool.id] ?? tool.favorite }));
  return {
    tools,
    categories: mergeCategories(TAGS, parseStoredCategories(storage.getItem(CUSTOM_CATEGORIES_KEY))),
    pinnedToolIds: parseStoredToolIds(storage.getItem(PINNED_TOOLS_KEY)),
    recentTools: parseStoredRecentTools(storage.getItem(RECENT_TOOLS_STORAGE_KEY)),
  };
}

function writeWorkspaceCache(storage: WorkspaceStorage, snapshot: WorkspaceSnapshot): void {
  storage.setItem(CUSTOM_TOOLS_KEY, JSON.stringify(snapshot.tools.filter((tool) => !BUILT_IN_IDS.has(tool.id))));
  storage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(
    snapshot.categories.filter((category) => !DEFAULT_CATEGORY_KEYS.has(category.toLocaleLowerCase())),
  ));
  storage.setItem(PINNED_TOOLS_KEY, JSON.stringify(snapshot.pinnedToolIds));
  storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(
    Object.fromEntries(snapshot.tools.map((tool) => [tool.id, tool.favorite])),
  ));
  storage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(snapshot.recentTools));
}

export async function synchronizeWorkspace(
  storage: WorkspaceStorage,
  api: WorkspaceApi,
): Promise<WorkspaceSnapshot> {
  const requiresMigration = storage.getItem(SUPABASE_MIGRATED_KEY) === null;
  if (requiresMigration) {
    await api.migrate(migrationPayloadFromStorage(storage));
  }
  const snapshot = await api.fetchSnapshot();
  writeWorkspaceCache(storage, snapshot);
  if (requiresMigration) storage.setItem(SUPABASE_MIGRATED_KEY, "true");
  return snapshot;
}

export async function createOptimisticToolPatch(
  current: WorkspaceSnapshot,
  id: string,
  patch: Pick<ToolPatch, "favorite" | "pinned">,
  api: WorkspaceApi,
  apply: (snapshot: WorkspaceSnapshot) => void,
): Promise<WorkspaceSnapshot> {
  const optimistic: WorkspaceSnapshot = {
    ...current,
    tools: current.tools.map((tool) => tool.id === id && patch.favorite !== undefined
      ? { ...tool, favorite: patch.favorite }
      : tool),
    pinnedToolIds: patch.pinned === undefined
      ? [...current.pinnedToolIds]
      : patch.pinned
        ? [...new Set([...current.pinnedToolIds, id])]
        : current.pinnedToolIds.filter((toolId) => toolId !== id),
  };
  apply(optimistic);
  try {
    const persisted = await api.patchTool(id, patch);
    const confirmed = {
      ...optimistic,
      tools: optimistic.tools.map((tool) => tool.id === id ? persisted : tool),
    };
    apply(confirmed);
    return confirmed;
  } catch (error) {
    apply(current);
    throw error;
  }
}

const EMPTY_WORKSPACE: WorkspaceSnapshot = {
  tools: TOOLS_RAW,
  categories: [...TAGS],
  pinnedToolIds: [],
  recentTools: [],
};

export function useCustomTools(api: WorkspaceApi = DEFAULT_WORKSPACE_API) {
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot>(EMPTY_WORKSPACE);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const notify = useCallback(() => {
    window.dispatchEvent(new Event(CUSTOM_TOOLS_CHANGED_EVENT));
  }, []);

  const applyWorkspace = useCallback((snapshot: WorkspaceSnapshot) => {
    writeWorkspaceCache(window.localStorage, snapshot);
    setWorkspace(snapshot);
    notify();
  }, [notify]);

  const retrySync = useCallback(async () => {
    setLoading(true);
    setSyncError(null);
    try {
      const snapshot = await synchronizeWorkspace(window.localStorage, api);
      setWorkspace(snapshot);
      notify();
    } catch {
      setSyncError("Workspace synchronization failed.");
    } finally {
      setLoading(false);
    }
  }, [api, notify]);

  useEffect(() => {
    const refresh = () => setWorkspace(readCachedWorkspace(window.localStorage));
    const initialRead = window.setTimeout(() => {
      refresh();
      void retrySync();
    }, 0);
    window.addEventListener("storage", refresh);
    window.addEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
    };
  }, [retrySync]);

  const addCategory = useCallback(async (name: string): Promise<AddCategoryResult> => {
    const category = await api.postCategory(name);
    const categories = mergeCategories(workspace.categories, [category.name]);
    applyWorkspace({ ...workspace, categories });
    return { categories, category: category.name };
  }, [api, applyWorkspace, workspace]);

  const addTool = useCallback(async (draft: CustomToolDraft, pin: boolean): Promise<Tool> => {
    const tool = await api.postTool(draft, pin);
    applyWorkspace({
      ...workspace,
      tools: [...workspace.tools.filter((item) => item.id !== tool.id), tool],
      pinnedToolIds: pin ? [...new Set([...workspace.pinnedToolIds, tool.id])] : workspace.pinnedToolIds,
    });
    return tool;
  }, [api, applyWorkspace, workspace]);

  const setToolPinned = useCallback(async (id: string, pinned: boolean): Promise<void> => {
    await createOptimisticToolPatch(workspace, id, { pinned }, api, applyWorkspace);
  }, [api, applyWorkspace, workspace]);

  const setToolFavorite = useCallback(async (id: string, favorite: boolean): Promise<void> => {
    await createOptimisticToolPatch(workspace, id, { favorite }, api, applyWorkspace);
  }, [api, applyWorkspace, workspace]);

  const customTools = useMemo(
    () => workspace.tools.filter((tool) => !BUILT_IN_IDS.has(tool.id)),
    [workspace.tools],
  );

  return {
    tools: workspace.tools,
    customTools,
    categories: workspace.categories,
    pinnedToolIds: workspace.pinnedToolIds,
    addCategory,
    addTool,
    setToolPinned,
    setToolFavorite,
    loading,
    syncError,
    retrySync,
  };
}
