"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DAILY_TASKS_STORAGE_KEY,
  millisecondsUntilTomorrow,
  readDailyTasks,
  writeDailyTasks,
  type DailyTask,
} from "@/lib/dashboard/daily-tasks";

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);

  const refresh = useCallback(() => setTasks(readDailyTasks()), []);

  useEffect(() => {
    const initialRead = window.setTimeout(refresh, 0);
    let midnightReset: number;
    const scheduleMidnightReset = () => {
      midnightReset = window.setTimeout(() => {
        try {
          window.localStorage.removeItem(DAILY_TASKS_STORAGE_KEY);
        } catch {
          // The in-memory list still resets when storage is unavailable.
        }
        setTasks([]);
        scheduleMidnightReset();
      }, millisecondsUntilTomorrow());
    };
    scheduleMidnightReset();
    window.addEventListener("storage", refresh);

    return () => {
      window.clearTimeout(initialRead);
      window.clearTimeout(midnightReset);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const updateTasks = useCallback((update: (current: DailyTask[]) => DailyTask[]) => {
    setTasks((current) => {
      const next = update(current);
      writeDailyTasks(next);
      return next;
    });
  }, []);

  const addTask = useCallback(
    (title: string) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return false;

      updateTasks((current) => [
        {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          createdAt: Date.now(),
          done: false,
        },
        ...current,
      ]);
      return true;
    },
    [updateTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      updateTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
      );
    },
    [updateTasks],
  );

  return { tasks, addTask, toggleTask };
}
