import { getLocalDateKey } from "./daily-tasks";

export const FOCUS_LOG_STORAGE_KEY = "phil-studio:focus-log";

export interface FocusEntry {
  id: string;
  task: string;
  durationMin: number;
  completedAt: number;
}

interface StoredFocusLog {
  date: string;
  entries: FocusEntry[];
}

export function readFocusLog(): FocusEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(FOCUS_LOG_STORAGE_KEY) ?? "null",
    ) as StoredFocusLog | null;

    if (stored?.date !== getLocalDateKey() || !Array.isArray(stored.entries)) {
      window.localStorage.removeItem(FOCUS_LOG_STORAGE_KEY);
      return [];
    }

    return stored.entries.filter(
      (entry): entry is FocusEntry =>
        typeof entry?.id === "string" &&
        typeof entry?.task === "string" &&
        typeof entry?.durationMin === "number" &&
        typeof entry?.completedAt === "number",
    );
  } catch {
    return [];
  }
}

export function writeFocusLog(entries: FocusEntry[]) {
  const value: StoredFocusLog = { date: getLocalDateKey(), entries };

  try {
    window.localStorage.setItem(FOCUS_LOG_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep the in-memory list usable when browser storage is unavailable.
  }
}
