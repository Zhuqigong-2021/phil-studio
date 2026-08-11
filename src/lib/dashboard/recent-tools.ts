import { patchWorkspaceTool } from "./workspace-data.ts";

export const RECENT_TOOLS_STORAGE_KEY = "phil-studio:recent-tools";
export const RECENT_TOOLS_CHANGED_EVENT = "phil-studio:recent-tools-changed";

export interface StoredRecentTool {
  id: string;
  openedAt: number;
}

export function parseStoredRecentTools(raw: string | null): StoredRecentTool[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (entry): entry is StoredRecentTool =>
        Boolean(entry) &&
        typeof entry === "object" &&
        typeof (entry as StoredRecentTool).id === "string" &&
        typeof (entry as StoredRecentTool).openedAt === "number" &&
        Number.isFinite((entry as StoredRecentTool).openedAt),
    );
  } catch {
    return [];
  }
}

export function readRecentTools(): StoredRecentTool[] {
  if (typeof window === "undefined") return [];

  try {
    return parseStoredRecentTools(window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY));
  } catch {
    return [];
  }
}

interface RecentToolDependencies {
  storage: Pick<Storage, "getItem" | "setItem">;
  now: () => number;
  dispatch: () => void;
  patchTool: (id: string, patch: { recordUse: true; usedAt: string }) => Promise<unknown>;
}

export function recordRecentTool(
  id: string,
  dependencies?: RecentToolDependencies,
) {
  try {
    const storage = dependencies?.storage ?? window.localStorage;
    const openedAt = dependencies?.now() ?? Date.now();
    const next = [
      { id, openedAt },
      ...parseStoredRecentTools(storage.getItem(RECENT_TOOLS_STORAGE_KEY)).filter((entry) => entry.id !== id),
    ];
    storage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
    if (dependencies) {
      dependencies.dispatch();
    } else {
      window.dispatchEvent(new Event(RECENT_TOOLS_CHANGED_EVENT));
    }
    const patch = dependencies?.patchTool ?? patchWorkspaceTool;
    void patch(id, { recordUse: true, usedAt: new Date(openedAt).toISOString() }).catch(() => undefined);
  } catch {
    // Opening the tool should still work when browser storage is unavailable.
  }
}

export function clearRecentTools() {
  try {
    window.localStorage.removeItem(RECENT_TOOLS_STORAGE_KEY);
    window.dispatchEvent(new Event(RECENT_TOOLS_CHANGED_EVENT));
  } catch {
    // Storage can be blocked by browser privacy settings.
  }
}

export function formatRecentTime(openedAt: number) {
  const elapsed = Date.now() - openedAt;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed < minute) return "Just now";
  if (elapsed < hour) return `${Math.floor(elapsed / minute)} min ago`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)} hr ago`;
  if (elapsed < 2 * day) return "Yesterday";
  return `${Math.floor(elapsed / day)} days ago`;
}
