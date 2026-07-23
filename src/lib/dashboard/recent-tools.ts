export const RECENT_TOOLS_STORAGE_KEY = "phil-studio:recent-tools";
export const RECENT_TOOLS_CHANGED_EVENT = "phil-studio:recent-tools-changed";

export interface StoredRecentTool {
  id: string;
  openedAt: number;
}

export function readRecentTools(): StoredRecentTool[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(RECENT_TOOLS_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];

    return value.filter(
      (entry): entry is StoredRecentTool =>
        typeof entry?.id === "string" && typeof entry?.openedAt === "number",
    );
  } catch {
    return [];
  }
}

export function recordRecentTool(id: string) {
  try {
    const next = [
      { id, openedAt: Date.now() },
      ...readRecentTools().filter((entry) => entry.id !== id),
    ];
    window.localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(RECENT_TOOLS_CHANGED_EVENT));
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
