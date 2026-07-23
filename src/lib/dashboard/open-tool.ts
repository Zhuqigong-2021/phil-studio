import type { KeyboardEvent } from "react";
import { recordRecentTool } from "./recent-tools";

export function openTool(id: string, url?: string) {
  if (!url) return;
  recordRecentTool(id);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openToolFromKeyboard(
  event: KeyboardEvent<HTMLElement>,
  id: string,
  url?: string,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openTool(id, url);
}
