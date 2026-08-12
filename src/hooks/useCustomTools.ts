"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  publishFavoriteToast,
  runFavoriteMutationWithToast,
} from "../lib/dashboard/favorite-toast.ts";
import { TAGS, TOOLS_RAW } from "../lib/dashboard/mock-data.ts";
import {
  parseStoredRecentTools,
  RECENT_TOOLS_CHANGED_EVENT,
  RECENT_TOOLS_STORAGE_KEY,
} from "../lib/dashboard/recent-tools.ts";
import {
  buildMigrationPayload,
  deleteWorkspaceToolRequest,
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
  deleteTool(id: string): Promise<void>;
}

const DEFAULT_WORKSPACE_API: WorkspaceApi = {
  fetchSnapshot: fetchWorkspaceSnapshot,
  migrate: migrateWorkspaceSnapshot,
  postTool: postWorkspaceTool,
  postCategory: postWorkspaceCategory,
  patchTool: patchWorkspaceTool,
  deleteTool: deleteWorkspaceToolRequest,
};

export async function refreshWorkspaceTools(
  api: WorkspaceApi,
  apply: (snapshot: WorkspaceSnapshot) => void,
): Promise<WorkspaceSnapshot> {
  const snapshot = await api.fetchSnapshot();
  apply(snapshot);
  return snapshot;
}

export async function addWorkspaceToolAndRefresh(
  api: WorkspaceApi,
  draft: CustomToolDraft,
  pin: boolean,
  apply: (snapshot: WorkspaceSnapshot) => void,
): Promise<Tool> {
  const tool = await api.postTool(draft, pin);
  await refreshWorkspaceTools(api, apply);
  return tool;
}

export async function updateWorkspaceToolAndRefresh(
  api: WorkspaceApi,
  id: string,
  patch: ToolPatch,
  apply: (snapshot: WorkspaceSnapshot) => void,
): Promise<WorkspaceSnapshot> {
  await api.patchTool(id, patch);
  const snapshot = await api.fetchSnapshot();
  apply(snapshot);
  return snapshot;
}

export async function deleteWorkspaceToolAndRefresh(
  api: WorkspaceApi,
  id: string,
  apply: (snapshot: WorkspaceSnapshot) => void,
): Promise<WorkspaceSnapshot> {
  await api.deleteTool(id);
  const snapshot = await api.fetchSnapshot();
  apply(snapshot);
  return snapshot;
}

export function createFavoritePendingTracker() {
  const pendingIds = new Set<string>();
  return {
    begin(id: string): boolean {
      if (pendingIds.has(id)) return false;
      pendingIds.add(id);
      return true;
    },
    finish(id: string): void {
      pendingIds.delete(id);
    },
    ids(): string[] {
      return [...pendingIds];
    },
  };
}

interface FavoriteMutationWithPendingOptions {
  id: string;
  pending: ReturnType<typeof createFavoritePendingTracker>;
  setPendingIds(ids: string[]): void;
  mutate(): Promise<void>;
}

export async function runFavoriteMutationWithPending({
  id,
  pending,
  setPendingIds,
  mutate,
}: FavoriteMutationWithPendingOptions): Promise<boolean> {
  if (!pending.begin(id)) return false;
  setPendingIds(pending.ids());
  try {
    await mutate();
    return true;
  } finally {
    pending.finish(id);
    setPendingIds(pending.ids());
  }
}

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

export function readCachedWorkspace(
  storage: WorkspaceStorage,
  authoritative?: WorkspaceSnapshot,
): WorkspaceSnapshot {
  const favoriteOverrides = parseFavoriteOverrides(storage.getItem(FAVORITES_STORAGE_KEY));
  const authoritativeById = new Map(authoritative?.tools.map((tool) => [tool.id, tool]));
  const tools = [...TOOLS_RAW, ...parseStoredTools(storage.getItem(CUSTOM_TOOLS_KEY))]
    .map((tool) => {
      const source = BUILT_IN_IDS.has(tool.id) ? authoritativeById.get(tool.id) ?? tool : tool;
      const cachedFavorite = authoritative ? undefined : favoriteOverrides[tool.id];
      return { ...source, favorite: cachedFavorite ?? source.favorite };
    });
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
  updateCache = true,
): Promise<WorkspaceSnapshot> {
  const requiresMigration = storage.getItem(SUPABASE_MIGRATED_KEY) === null;
  if (requiresMigration) {
    await api.migrate(migrationPayloadFromStorage(storage));
  }
  const snapshot = await api.fetchSnapshot();
  if (updateCache) writeWorkspaceCache(storage, snapshot);
  if (requiresMigration) storage.setItem(SUPABASE_MIGRATED_KEY, "true");
  return snapshot;
}

const workspaceSyncs = new WeakMap<object, WeakMap<object, Promise<WorkspaceSnapshot>>>();

export function synchronizeWorkspaceOnce(
  storage: WorkspaceStorage,
  api: WorkspaceApi,
): Promise<WorkspaceSnapshot> {
  let apiSyncs = workspaceSyncs.get(storage);
  if (!apiSyncs) {
    apiSyncs = new WeakMap();
    workspaceSyncs.set(storage, apiSyncs);
  }
  const active = apiSyncs.get(api);
  if (active) return active;
  const request = synchronizeWorkspace(storage, api, false).finally(() => {
    apiSyncs?.delete(api);
  });
  apiSyncs.set(api, request);
  return request;
}

export function mergeCreatedTool(current: WorkspaceSnapshot, tool: Tool, pin: boolean): WorkspaceSnapshot {
  return {
    ...current,
    tools: [...current.tools.filter((item) => item.id !== tool.id), tool],
    pinnedToolIds: pin ? [...new Set([...current.pinnedToolIds, tool.id])] : current.pinnedToolIds,
  };
}

export function mergeCreatedCategory(current: WorkspaceSnapshot, category: string): WorkspaceSnapshot {
  return { ...current, categories: mergeCategories(current.categories, [category]) };
}

export function createSyncGuard() {
  let generation = 0;
  const revisions = new Map<number, number>();
  return {
    begin(revision: number) {
      generation += 1;
      revisions.set(generation, revision);
      return generation;
    },
    isLatest(id: number) {
      return id === generation;
    },
    isCurrent(id: number, revision: number) {
      return id === generation && revisions.get(id) === revision;
    },
  };
}

interface GuardedSyncHandlers<T> {
  revision(): number;
  start(): void;
  success(value: T): void;
  failure(): void;
  finish(): void;
}

export async function runGuardedSync<T>(
  guard: ReturnType<typeof createSyncGuard>,
  task: () => Promise<T>,
  handlers: GuardedSyncHandlers<T>,
): Promise<void> {
  const requestId = guard.begin(handlers.revision());
  handlers.start();
  try {
    const value = await task();
    if (guard.isCurrent(requestId, handlers.revision())) handlers.success(value);
  } catch {
    if (guard.isLatest(requestId)) handlers.failure();
  } finally {
    if (guard.isLatest(requestId)) handlers.finish();
  }
}

export async function createOptimisticToolPatch(
  current: WorkspaceSnapshot,
  id: string,
  patch: Pick<ToolPatch, "favorite" | "pinned">,
  api: WorkspaceApi,
  apply: (snapshot: WorkspaceSnapshot) => void,
  getCurrent: () => WorkspaceSnapshot = () => current,
  versions: Map<string, symbol> = new Map(),
): Promise<WorkspaceSnapshot> {
  const latest = getCurrent();
  const previousFavorite = latest.tools.find((tool) => tool.id === id)?.favorite;
  const previousPinned = latest.pinnedToolIds.includes(id);
  const token = Symbol(id);
  const fields = (["favorite", "pinned"] as const).filter((field) => patch[field] !== undefined);
  for (const field of fields) versions.set(`${id}:${field}`, token);
  const isLatest = (field: "favorite" | "pinned") => versions.get(`${id}:${field}`) === token;
  const optimistic: WorkspaceSnapshot = {
    ...latest,
    tools: latest.tools.map((tool) => tool.id === id && patch.favorite !== undefined
      ? { ...tool, favorite: patch.favorite }
      : tool),
    pinnedToolIds: patch.pinned === undefined
      ? [...latest.pinnedToolIds]
      : patch.pinned
        ? [...new Set([...latest.pinnedToolIds, id])]
        : latest.pinnedToolIds.filter((toolId) => toolId !== id),
  };
  apply(optimistic);
  try {
    const persisted = await api.patchTool(id, patch);
    const currentWorkspace = getCurrent();
    const confirmed = {
      ...currentWorkspace,
      tools: currentWorkspace.tools.map((tool) => tool.id === id && patch.favorite !== undefined && isLatest("favorite")
        ? { ...tool, favorite: persisted.favorite }
        : tool),
    };
    apply(confirmed);
    return confirmed;
  } catch (error) {
    const currentWorkspace = getCurrent();
    const rollback = {
      ...currentWorkspace,
      tools: currentWorkspace.tools.map((tool) =>
        tool.id === id && patch.favorite !== undefined && previousFavorite !== undefined && isLatest("favorite")
          ? { ...tool, favorite: previousFavorite }
          : tool),
      pinnedToolIds: patch.pinned === undefined || !isLatest("pinned")
        ? currentWorkspace.pinnedToolIds
        : previousPinned
          ? [...new Set([...currentWorkspace.pinnedToolIds, id])]
          : currentWorkspace.pinnedToolIds.filter((toolId) => toolId !== id),
    };
    apply(rollback);
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
  const [favoritePendingIds, setFavoritePendingIds] = useState<string[]>([]);
  const workspaceRef = useRef(workspace);
  const revisionRef = useRef(0);
  const hasAuthoritativeWorkspaceRef = useRef(false);
  const syncGuardRef = useRef(createSyncGuard());
  const patchVersionsRef = useRef(new Map<string, symbol>());
  const favoritePendingRef = useRef(createFavoritePendingTracker());

  const notify = useCallback(() => {
    window.dispatchEvent(new Event(CUSTOM_TOOLS_CHANGED_EVENT));
  }, []);

  const applyWorkspace = useCallback((snapshot: WorkspaceSnapshot) => {
    workspaceRef.current = snapshot;
    revisionRef.current += 1;
    writeWorkspaceCache(window.localStorage, snapshot);
    setWorkspace(snapshot);
    notify();
  }, [notify]);

  const retrySync = useCallback(async () => {
    await runGuardedSync(
      syncGuardRef.current,
      () => synchronizeWorkspaceOnce(window.localStorage, api),
      {
        revision: () => revisionRef.current,
        start: () => { setLoading(true); setSyncError(null); },
        success: (snapshot) => {
          hasAuthoritativeWorkspaceRef.current = true;
          applyWorkspace(snapshot);
        },
        failure: () => setSyncError("Workspace synchronization failed."),
        finish: () => setLoading(false),
      },
    );
  }, [api, applyWorkspace]);

  const refreshTools = useCallback(async (): Promise<WorkspaceSnapshot> => {
    setLoading(true);
    setSyncError(null);
    try {
      return await refreshWorkspaceTools(api, (snapshot) => {
        hasAuthoritativeWorkspaceRef.current = true;
        applyWorkspace(snapshot);
      });
    } catch (error) {
      setSyncError("Workspace synchronization failed.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api, applyWorkspace]);

  useEffect(() => {
    const refresh = () => {
      const cached = readCachedWorkspace(
        window.localStorage,
        hasAuthoritativeWorkspaceRef.current ? workspaceRef.current : undefined,
      );
      workspaceRef.current = cached;
      revisionRef.current += 1;
      setWorkspace(cached);
    };
    const refreshFromServer = () => {
      void retrySync();
    };
    const initialRead = window.setTimeout(() => {
      refresh();
      void retrySync();
    }, 0);
    window.addEventListener("focus", refreshFromServer);
    window.addEventListener("storage", refresh);
    window.addEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
    window.addEventListener(RECENT_TOOLS_CHANGED_EVENT, refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("focus", refreshFromServer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CUSTOM_TOOLS_CHANGED_EVENT, refresh);
      window.removeEventListener(RECENT_TOOLS_CHANGED_EVENT, refresh);
    };
  }, [retrySync]);

  const addCategory = useCallback(async (name: string): Promise<AddCategoryResult> => {
    const category = await api.postCategory(name);
    const next = mergeCreatedCategory(workspaceRef.current, category.name);
    applyWorkspace(next);
    return { categories: next.categories, category: category.name };
  }, [api, applyWorkspace]);

  const addTool = useCallback(async (draft: CustomToolDraft, pin: boolean): Promise<Tool> => {
    return addWorkspaceToolAndRefresh(api, draft, pin, (snapshot) => {
      hasAuthoritativeWorkspaceRef.current = true;
      applyWorkspace(snapshot);
    });
  }, [api, applyWorkspace]);

  const setToolPinned = useCallback(async (id: string, pinned: boolean): Promise<void> => {
    await createOptimisticToolPatch(
      workspaceRef.current, id, { pinned }, api, applyWorkspace, () => workspaceRef.current, patchVersionsRef.current,
    );
  }, [api, applyWorkspace]);

  const updateTool = useCallback(async (id: string, patch: ToolPatch): Promise<void> => {
    await updateWorkspaceToolAndRefresh(api, id, patch, (snapshot) => {
      hasAuthoritativeWorkspaceRef.current = true;
      applyWorkspace(snapshot);
    });
  }, [api, applyWorkspace]);

  const deleteTool = useCallback(async (id: string): Promise<void> => {
    await deleteWorkspaceToolAndRefresh(api, id, (snapshot) => {
      hasAuthoritativeWorkspaceRef.current = true;
      applyWorkspace(snapshot);
    });
  }, [api, applyWorkspace]);

  const setToolFavorite = useCallback(async (id: string, favorite: boolean): Promise<void> => {
    const toolName = workspaceRef.current.tools.find((tool) => tool.id === id)?.name ?? "Tool";
    await runFavoriteMutationWithPending({
      id,
      pending: favoritePendingRef.current,
      setPendingIds: setFavoritePendingIds,
      mutate: async () => {
        await runFavoriteMutationWithToast({
          toolName,
          favorite,
          mutate: async () => {
            await createOptimisticToolPatch(
              workspaceRef.current, id, { favorite }, api, applyWorkspace, () => workspaceRef.current, patchVersionsRef.current,
            );
          },
          publish: publishFavoriteToast,
        });
      },
    });
  }, [api, applyWorkspace]);

  const customTools = useMemo(
    () => workspace.tools.filter((tool) => !BUILT_IN_IDS.has(tool.id)),
    [workspace.tools],
  );

  return {
    tools: workspace.tools,
    customTools,
    categories: workspace.categories,
    pinnedToolIds: workspace.pinnedToolIds,
    recentTools: workspace.recentTools,
    addCategory,
    addTool,
    setToolPinned,
    setToolFavorite,
    refreshTools,
    updateTool,
    deleteTool,
    favoritePendingIds,
    loading,
    syncError,
    retrySync,
  };
}
