export const DATABASE_TOAST_EVENT = "phil-studio:database-toast";

export type DatabaseToastTone = "success" | "error" | "info";

export interface DatabaseToastDetail {
  id: number;
  tone: DatabaseToastTone;
  message: string;
}

let nextToastId = 0;

export function publishDatabaseToast({
  tone,
  message,
}: Pick<DatabaseToastDetail, "tone" | "message">): void {
  if (typeof window === "undefined") return;
  nextToastId += 1;
  window.dispatchEvent(new CustomEvent<DatabaseToastDetail>(DATABASE_TOAST_EVENT, {
    detail: { id: nextToastId, tone, message },
  }));
}

export function databaseSuccessMessage(action: "updated" | "deleted", toolName: string): string {
  return `${action === "updated" ? "Updated" : "Deleted"}: ${toolName}`;
}

function errorStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export function databaseErrorMessage(error: unknown, action: string, toolName: string): string {
  const status = errorStatus(error);
  const prefix = `Could not ${action} ${toolName}.`;
  if (status === 400) return `${prefix} Please check the tool details and try again.`;
  if (status === 401) return `${prefix} Please sign in again.`;
  if (status === 403) return `${prefix} You do not have permission to make this change.`;
  if (status === 503) return `${prefix} The workspace service is temporarily unavailable. Please try again.`;
  if (error instanceof TypeError) return `${prefix} Check your connection and try again.`;
  return `${prefix} Please try again.`;
}
