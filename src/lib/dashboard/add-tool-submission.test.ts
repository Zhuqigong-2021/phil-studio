import assert from "node:assert/strict";
import test from "node:test";

import {
  addToolFormReducer,
  createEmptyAddToolForm,
  createAddToolSubmissionGuard,
  runAddToolSubmission,
  type AddToolSubmissionToast,
} from "./add-tool-submission.ts";

test("keeps Save pending through the database promise and ignores a duplicate submit", async () => {
  const guard = createAddToolSubmissionGuard();
  guard.openSession();
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

  for (const closePath of ["backdrop", "close button", "Cancel"]) {
    assert.equal(
      guard.requestClose(() => { closeCalls += 1; }),
      false,
      `${closePath} must stay blocked while the database promise is unresolved`,
    );
  }
  assert.equal(closeCalls, 0);
  assert.equal(await runAddToolSubmission(options), false);
  assert.equal(saveCalls, 1);

  resolveSave();
  assert.equal(await first, true);
  assert.deepEqual(pendingStates, [true, false]);
  assert.deepEqual(published, [
    { tone: "success", message: "Notion added successfully" },
  ]);
  assert.equal(closeCalls, 1);
});

test("an older save completion cannot close a newly opened form session", async () => {
  const guard = createAddToolSubmissionGuard();
  guard.openSession();
  let closeCalls = 0;
  let resolveSave!: () => void;
  const databaseSave = new Promise<void>((resolve) => { resolveSave = resolve; });

  const first = runAddToolSubmission({
    guard,
    toolName: "Notion",
    save: async () => databaseSave,
    setPending: () => undefined,
    setError: () => undefined,
    close: () => { closeCalls += 1; },
    publish: () => undefined,
  });

  guard.openSession();
  resolveSave();

  assert.equal(await first, true);
  assert.equal(closeCalls, 0);
});

test("retains the form on rejection and publishes the useful validation error", async () => {
  let form = createEmptyAddToolForm();
  const populatedFields = {
    url: "ftp://notion.so",
    name: "Notion",
    description: "Connected notes workspace",
    tags: new Set(["Productivity", "AI"]),
    aliasInput: "draft alias",
    aliases: ["Notes", "Wiki"],
    source: "external" as const,
    iconKey: "notion",
    accent: "violet" as const,
    pin: true,
  };
  form = addToolFormReducer(form, populatedFields);
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
    toolName: form.name,
    save: async () => {
      assert.deepEqual(form, populatedFields);
      throw failure;
    },
    setPending: (pending) => pendingStates.push(pending),
    setError: (message) => errors.push(message),
    close: () => { closeCalls += 1; },
    publish: (toast) => published.push(toast),
  });

  assert.equal(result, false);
  assert.deepEqual(form, populatedFields);
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

test("closes after creation when workspace refresh failed without inviting a duplicate retry", async () => {
  const errors: string[] = [];
  const published: AddToolSubmissionToast[] = [];
  let closeCalls = 0;

  const result = await runAddToolSubmission({
    guard: createAddToolSubmissionGuard(),
    toolName: "Notion",
    save: async () => ({ workspaceRefreshFailed: true }),
    setPending: () => undefined,
    setError: (message) => errors.push(message),
    close: () => { closeCalls += 1; },
    publish: (toast) => published.push(toast),
  });

  assert.equal(result, true);
  assert.equal(closeCalls, 1);
  assert.deepEqual(errors, [""]);
  assert.deepEqual(published, [{
    tone: "success",
    message: "Notion added successfully. Workspace refresh failed and will retry later.",
  }]);
  assert.doesNotMatch(published[0]?.message ?? "", /could not add|try adding/i);
});
