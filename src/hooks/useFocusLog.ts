"use client";

import { useCallback, useEffect, useState } from "react";
import { millisecondsUntilTomorrow } from "@/lib/dashboard/daily-tasks";
import {
  FOCUS_LOG_STORAGE_KEY,
  readFocusLog,
  writeFocusLog,
  type FocusEntry,
} from "@/lib/dashboard/focus-log";

export function useFocusLog() {
  const [entries, setEntries] = useState<FocusEntry[]>([]);

  const refresh = useCallback(() => setEntries(readFocusLog()), []);

  useEffect(() => {
    const initialRead = window.setTimeout(refresh, 0);
    let midnightReset: number;
    const scheduleMidnightReset = () => {
      midnightReset = window.setTimeout(() => {
        try {
          window.localStorage.removeItem(FOCUS_LOG_STORAGE_KEY);
        } catch {
          // The in-memory list still resets when storage is unavailable.
        }
        setEntries([]);
        scheduleMidnightReset();
      }, millisecondsUntilTomorrow());
    };
    scheduleMidnightReset();
    window.addEventListener("storage", refresh);

    return () => {
      window.clearTimeout(initialRead);
      window.clearTimeout(midnightReset);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const addEntry = useCallback((task: string, durationMin: number) => {
    setEntries((current) => {
      const next: FocusEntry[] = [
        { id: crypto.randomUUID(), task, durationMin, completedAt: Date.now() },
        ...current,
      ];
      writeFocusLog(next);
      return next;
    });
  }, []);

  return { entries, addEntry };
}
