export const FAVORITES_STORAGE_KEY = "phil-studio:favorite-overrides";
export const FAVORITES_CHANGED_EVENT = "phil-studio:favorites-changed";

export function readFavoriteOverrides(): Record<string, boolean> {
  if (typeof window === "undefined") return {};

  try {
    const value = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "{}") as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value as Record<string, boolean>;
  } catch {
    return {};
  }
}

// currentValue is the effective favorite state right before the toggle (override ?? base),
// computed by the caller since only it knows each tool's base favorite flag.
export function toggleFavoriteOverride(id: string, currentValue: boolean) {
  try {
    const next = { ...readFavoriteOverrides(), [id]: !currentValue };
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  } catch {
    // Favoriting should still work in-memory when storage is unavailable — callers that
    // don't also hold local state just won't see the toggle persist across reloads.
  }
}
