import assert from "node:assert/strict";
import test from "node:test";

import { claimDiaTextReveal } from "./dia-text-reveal-state.ts";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test("claims a dashboard reveal only once for the same browser session", () => {
  const storage = new MemoryStorage();

  assert.equal(claimDiaTextReveal(storage, "dashboard-greeting"), true);
  assert.equal(claimDiaTextReveal(storage, "dashboard-greeting"), false);
});

test("allows a reveal when session storage is unavailable", () => {
  const storage = {
    getItem() {
      throw new Error("storage blocked");
    },
    setItem() {
      throw new Error("storage blocked");
    },
  };

  assert.equal(claimDiaTextReveal(storage, "dashboard-greeting"), true);
});
