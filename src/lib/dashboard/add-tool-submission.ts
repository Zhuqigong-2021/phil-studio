import { databaseErrorMessage } from "./tool-mutations.ts";
import type { Accent, SourceType } from "./types.ts";

export interface AddToolSubmissionToast {
  tone: "success" | "error";
  message: string;
}

export interface AddToolFormState {
  url: string;
  name: string;
  description: string;
  tags: Set<string>;
  aliasInput: string;
  aliases: string[];
  source: SourceType;
  iconKey: string;
  accent: Accent;
  pin: boolean;
}

export type AddToolFormUpdate =
  | Partial<AddToolFormState>
  | ((current: AddToolFormState) => AddToolFormState);

export function createEmptyAddToolForm(): AddToolFormState {
  return {
    url: "",
    name: "",
    description: "",
    tags: new Set<string>(),
    aliasInput: "",
    aliases: [],
    source: "internal",
    iconKey: "app-window",
    accent: "blue",
    pin: false,
  };
}

export function addToolFormReducer(
  current: AddToolFormState,
  update: AddToolFormUpdate,
): AddToolFormState {
  return typeof update === "function" ? update(current) : { ...current, ...update };
}

export function createAddToolSubmissionGuard() {
  let session = 0;
  let activeSubmission: { session: number } | null = null;
  return {
    openSession(): void {
      session += 1;
    },
    begin(): { session: number } | null {
      if (activeSubmission) return null;
      activeSubmission = { session };
      return activeSubmission;
    },
    requestClose(close: () => void): boolean {
      if (activeSubmission) return false;
      close();
      return true;
    },
    isCurrent(submission: { session: number }): boolean {
      return submission.session === session;
    },
    finish(submission: { session: number }): void {
      if (activeSubmission === submission) activeSubmission = null;
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
  const submission = guard.begin();
  if (!submission) return false;
  setPending(true);
  setError("");
  try {
    await save();
    publish({ tone: "success", message: `${toolName || "Tool"} added successfully` });
    if (guard.isCurrent(submission)) close();
    return true;
  } catch (error) {
    const message = addToolErrorMessage(error, toolName);
    setError(message);
    publish({ tone: "error", message });
    return false;
  } finally {
    guard.finish(submission);
    setPending(false);
  }
}
