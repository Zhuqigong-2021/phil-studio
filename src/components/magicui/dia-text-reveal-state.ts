export type DiaTextRevealStorage = Pick<Storage, "getItem" | "setItem">;

export function claimDiaTextReveal(
  storage: DiaTextRevealStorage,
  key: string,
): boolean {
  try {
    if (storage.getItem(key) === "played") return false;
    storage.setItem(key, "played");
    return true;
  } catch {
    return true;
  }
}
