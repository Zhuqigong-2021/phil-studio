import assert from "node:assert/strict";
import test from "node:test";

import {
  createAddToolSubmissionGuard,
  runAddToolSubmission,
  type AddToolSubmissionToast,
} from "./add-tool-submission.ts";

test("keeps Save pending through the database promise and ignores a duplicate submit", async () => {
  const guard = createAddToolSubmissionGuard();
  const pendingStates: boolean[] = [];
  const published: AddToolSubmissionToast[] = [];
  let closeCalls = 0;
  let saveCalls = 0;
  let resolveSave!: () => void;
  const databaseSave = new Promise<void>((resolve) => { resolveSave = resolve; });
  const options = {
    guard,
    toolName: "Notion",
    save: async () => { saveCalls += 1; await databaseSave; },
    setPending: (pending: boolean) => pendingStates.push(pending),
    setError: () => undefined,
    close: () => { closeCalls += 1; },
    publish: (toast: AddToolSubmissionToast) => published.push(toast),
  };

  const first = runAddToolSubmission(options);
  const duplicate = await runAddToolSubmission(options);

  assert.equal(duplicate, false);
  assert.equal(saveCalls, 1);
  assert.deepEqual(pendingStates, [true]);
  assert.deepEqual(published, []);
  assert.equal(closeCalls, 0);

  resolveSave();
  assert.equal(await first, true);
  assert.deepEqual(pendingStates, [true, false]);
  assert.deepEqual(published, [
    { tone: "success", message: "Notion added successfully" },
  ]);
  assert.equal(closeCalls, 1);
});

test("retains the form on rejection and publishes the useful validation error", async () => {
  const fields = { name: "Notion", url: "ftp://notion.so" };
  const originalFields = { ...fields };
  const pendingStates: boolean[] = [];
  const errors: string[] = [];
  const published: AddToolSubmissionToast[] = [];
  let closeCalls = 0;
  const failure = Object.assign(
    new Error("Tool URL must use HTTP or HTTPS."),
    { status: 400 },
  );

  const result = await runAddToolSubmission({
    guard: createAddToolSubmissionGuard(),
    toolName: fields.name,
    save: async () => { throw failure; },
    setPending: (pending) => pendingStates.push(pending),
    setError: (message) => errors.push(message),
    close: () => { closeCalls += 1; },
    publish: (toast) => published.push(toast),
  });

  assert.equal(result, false);
  assert.deepEqual(fields, originalFields);
  assert.equal(closeCalls, 0);
  assert.deepEqual(pendingStates, [true, false]);
  assert.deepEqual(errors, ["", failure.message]);
  assert.deepEqual(published, [{ tone: "error", message: failure.message }]);
});

test("maps retryable Add Tool failures without claiming a save succeeded", async () => {
  const published: AddToolSubmissionToast[] = [];

  await runAddToolSubmission({
    guard: createAddToolSubmissionGuard(),
    toolName: "Notion",
    save: async () => { throw Object.assign(new Error("offline"), { status: 503 }); },
    setPending: () => undefined,
    setError: () => undefined,
    close: () => undefined,
    publish: (toast) => published.push(toast),
  });

  assert.equal(published.length, 1);
  assert.equal(published[0]?.tone, "error");
  assert.match(published[0]?.message ?? "", /temporarily unavailable/i);
  assert.doesNotMatch(published[0]?.message ?? "", /added successfully/i);
});
