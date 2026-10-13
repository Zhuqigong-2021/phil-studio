import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "./route.ts";

test("database health requires authentication and reports upstream failures without exposing data", async () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  try {
    delete process.env.CRON_SECRET;
    const request = () => new Request("https://example.com/api/cron/database-health", {
      headers: { Authorization: "Bearer test-secret" },
    });
    assert.equal((await GET(request())).status, 503);
    process.env.CRON_SECRET = "test-secret";
    assert.equal((await GET(new Request("https://example.com"))).status, 401);
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "test-key";
    globalThis.fetch = async (url, options) => {
      assert.equal(String(url), "https://example.supabase.co/rest/v1/tools?select=id&limit=1");
      assert.equal(options?.cache, "no-store");
      assert.ok(options?.signal);
      return Response.json([{ id: "private-row" }]);
    };
    const response = await GET(request());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(response.headers.get("cache-control"), "no-store");
    for (const status of [401, 403, 404, 429, 500]) {
      globalThis.fetch = async () => new Response("sensitive upstream error", { status });
      const failed = await GET(request());
      assert.equal(failed.status, 502);
      assert.deepEqual(await failed.json(), { ok: false });
    }
    globalThis.fetch = async () => { throw new DOMException("Timed out", "TimeoutError"); };
    assert.equal((await GET(request())).status, 502);
  } finally {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  }
});
