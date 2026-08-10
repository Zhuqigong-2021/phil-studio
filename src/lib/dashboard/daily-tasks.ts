export const DAILY_TASKS_STORAGE_KEY = "phil-studio:daily-tasks";

export interface DailyTask {
  id: string;
  title: string;
  createdAt: number;
  done: boolean;
}

interface StoredDailyTasks {
  date: string;
  tasks: DailyTask[];
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readDailyTasks(): DailyTask[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(DAILY_TASKS_STORAGE_KEY) ?? "null",
    ) as StoredDailyTasks | null;

    if (stored?.date !== getLocalDateKey() || !Array.isArray(stored.tasks)) {
      window.localStorage.removeItem(DAILY_TASKS_STORAGE_KEY);
      return [];
    }

    return stored.tasks.filter(
      (task): task is DailyTask =>
        typeof task?.id === "string" &&
        typeof task?.title === "string" &&
        typeof task?.createdAt === "number" &&
        typeof task?.done === "boolean",
    );
  } catch {
    return [];
  }
}

export function writeDailyTasks(tasks: DailyTask[]) {
  const value: StoredDailyTasks = { date: getLocalDateKey(), tasks };

  try {
    window.localStorage.setItem(DAILY_TASKS_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep the in-memory list usable when browser storage is unavailable.
  }
}

export function renameDailyTask(
  tasks: DailyTask[],
  id: string,
  title: string,
) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return tasks;

  return tasks.map((task) =>
    task.id === id ? { ...task, title: trimmedTitle } : task,
  );
}

export function deleteDailyTask(tasks: DailyTask[], id: string) {
  return tasks.filter((task) => task.id !== id);
}

export function millisecondsUntilTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
}

export function formatTaskTime(createdAt: number) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(createdAt);
}
