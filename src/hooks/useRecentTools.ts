"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RECENT_TOOLS_CHANGED_EVENT,
  clearRecentTools,
  readRecentTools,
  type StoredRecentTool,
} from "@/lib/dashboard/recent-tools";

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<StoredRecentTool[]>([]);
  const refresh = useCallback(() => setRecentTools(readRecentTools()), []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener(RECENT_TOOLS_CHANGED_EVENT, refresh);
    const initialRead = window.setTimeout(refresh, 0);

    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(RECENT_TOOLS_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  return { recentTools, clearRecentTools };
}
