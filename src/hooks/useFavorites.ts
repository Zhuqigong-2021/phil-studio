"use client";

import { useCallback, useMemo } from "react";
import { useCustomTools } from "./useCustomTools";

export function useFavorites() {
  const { tools, setToolFavorite } = useCustomTools();
  const overrides = useMemo(
    () => Object.fromEntries(tools.map((tool) => [tool.id, tool.favorite])),
    [tools],
  );
  const toggleFavorite = useCallback((id: string, currentValue: boolean) => {
    void setToolFavorite(id, !currentValue).catch(() => undefined);
  }, [setToolFavorite]);

  return { overrides, toggleFavorite };
}
