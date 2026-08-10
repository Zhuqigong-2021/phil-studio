import assert from "node:assert/strict";
import test from "node:test";
import {
  deleteDailyTask,
  renameDailyTask,
  type DailyTask,
} from "./daily-tasks.ts";

const tasks: DailyTask[] = [
  { id: "first", title: "First task", createdAt: 1, done: false },
  { id: "second", title: "Second task", createdAt: 2, done: true },
];

test("renames one task, trims the title, and preserves its other fields", () => {
  const renamed = renameDailyTask(tasks, "first", "  Updated task  ");

  assert.deepEqual(renamed, [
    { id: "first", title: "Updated task", createdAt: 1, done: false },
    tasks[1],
  ]);
  assert.equal(tasks[0].title, "First task");
});

test("does not replace a task title with blank content", () => {
  assert.deepEqual(renameDailyTask(tasks, "first", "   "), tasks);
});

test("deletes only the selected task", () => {
  assert.deepEqual(deleteDailyTask(tasks, "first"), [tasks[1]]);
});
