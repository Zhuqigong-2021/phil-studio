"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_CHANGED_EVENT,
  readFavoriteOverrides,
  toggleFavoriteOverride,
} from "@/lib/dashboard/favorites";

// Reads/writes favorite overrides via localStorage + a custom event (same pattern as
// useRecentTools), so any number of components — the Favorites panel, the search palette,
// wherever — can toggle a tool's favorite state and stay in sync without prop drilling.
export function useFavorites() {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => setOverrides(readFavoriteOverrides()), []);

  useEffect(() => {
    const initialRead = window.setTimeout(refresh, 0);
    window.addEventListener(FAVORITES_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const toggleFavorite = useCallback((id: string, currentValue: boolean) => {
    toggleFavoriteOverride(id, currentValue);
    refresh();
  }, [refresh]);

  return { overrides, toggleFavorite };
}
