import { databaseErrorMessage } from "./tool-mutations.ts";

export interface AddToolSubmissionToast {
  tone: "success" | "error";
  message: string;
}

export function createAddToolSubmissionGuard() {
  let pending = false;
  return {
    begin(): boolean {
      if (pending) return false;
      pending = true;
      return true;
    },
    finish(): void {
      pending = false;
    },
  };
}

interface AddToolSubmissionOptions {
  guard: ReturnType<typeof createAddToolSubmissionGuard>;
  toolName: string;
  save(): Promise<void>;
  setPending(pending: boolean): void;
  setError(message: string): void;
  close(): void;
  publish(toast: AddToolSubmissionToast): void;
}

function errorStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

function addToolErrorMessage(error: unknown, toolName: string): string {
  if (errorStatus(error) === 400 && error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return databaseErrorMessage(error, "add", toolName || "tool");
}

export async function runAddToolSubmission({
  guard,
  toolName,
  save,
  setPending,
  setError,
  close,
  publish,
}: AddToolSubmissionOptions): Promise<boolean> {
  if (!guard.begin()) return false;
  setPending(true);
  setError("");
  try {
    await save();
    publish({ tone: "success", message: `${toolName || "Tool"} added successfully` });
    close();
    return true;
  } catch (error) {
    const message = addToolErrorMessage(error, toolName);
    setError(message);
    publish({ tone: "error", message });
    return false;
  } finally {
    guard.finish();
    setPending(false);
  }
}
