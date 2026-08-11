export const FAVORITE_TOAST_EVENT = "phil-studio:favorite-toast";

export type FavoriteToastTone = "success" | "info" | "error";

export interface FavoriteToastDetail {
  id: number;
  tone: FavoriteToastTone;
  message: string;
}

interface FavoriteMutationOptions {
  toolName: string;
  favorite: boolean;
  mutate: () => Promise<void>;
  publish: (detail: FavoriteToastDetail) => void;
}

let nextToastId = 0;

function toastDetail(tone: FavoriteToastTone, message: string): FavoriteToastDetail {
  nextToastId += 1;
  return { id: nextToastId, tone, message };
}

export function publishFavoriteToast(detail: FavoriteToastDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FAVORITE_TOAST_EVENT, { detail }));
}

export async function runFavoriteMutationWithToast({
  toolName,
  favorite,
  mutate,
  publish,
}: FavoriteMutationOptions): Promise<void> {
  try {
    await mutate();
    publish(toastDetail(
      favorite ? "success" : "info",
      favorite ? `Favorited: ${toolName}` : `Removed from favorites: ${toolName}`,
    ));
  } catch (error) {
    publish(toastDetail(
      "error",
      favorite
        ? `Could not favorite ${toolName}. Previous state restored.`
        : `Could not remove ${toolName} from favorites. Previous state restored.`,
    ));
    throw error;
  }
}
