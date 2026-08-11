import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { register } from "node:module";
import test from "node:test";

const loader = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: "data:text/javascript,export%20default%20undefined",
    };
  }

  return nextResolve(specifier, context);
}
`;

register(`data:text/javascript,${encodeURIComponent(loader)}`, import.meta.url);

const { getSupabaseServerClient, SupabaseConfigurationError } = await import(
  "./server.ts"
);

const originalUrl = process.env.SUPABASE_URL;
const originalSecret = process.env.SUPABASE_SECRET_KEY;

test.afterEach(() => {
  if (originalUrl === undefined) {
    delete process.env.SUPABASE_URL;
  } else {
    process.env.SUPABASE_URL = originalUrl;
  }

  if (originalSecret === undefined) {
    delete process.env.SUPABASE_SECRET_KEY;
  } else {
    process.env.SUPABASE_SECRET_KEY = originalSecret;
  }
});

test("rejects missing server configuration without exposing secret values", () => {
  process.env.SUPABASE_URL = "https://uvicpezvhxmqcnlxjeoz.supabase.co";
  delete process.env.SUPABASE_SECRET_KEY;

  assert.throws(
    () => getSupabaseServerClient(),
    (error: unknown) => {
      assert.ok(error instanceof SupabaseConfigurationError);
      assert.equal(error.message, "Supabase server configuration is unavailable.");
      assert.doesNotMatch(error.message, /uvicpezvhxmqcnlxjeoz/);
      return true;
    },
  );
});

test("rejects a missing or invalid server URL with the same safe message", () => {
  process.env.SUPABASE_SECRET_KEY = "server-only-secret";

  for (const url of [undefined, "", "http://example.com", "not-a-url"]) {
    if (url === undefined) {
      delete process.env.SUPABASE_URL;
    } else {
      process.env.SUPABASE_URL = url;
    }

    assert.throws(
      () => getSupabaseServerClient(),
      (error: unknown) => {
        assert.ok(error instanceof SupabaseConfigurationError);
        assert.equal(error.message, "Supabase server configuration is unavailable.");
        return true;
      },
    );
  }
});

test("creates a non-persistent server client from valid configuration", () => {
  process.env.SUPABASE_URL = "https://uvicpezvhxmqcnlxjeoz.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "server-only-secret";

  const client = getSupabaseServerClient();

  assert.equal(typeof client.from, "function");
});

test("marks the module server-only and never references public environment variables", async () => {
  const source = await readFile(new URL("./server.ts", import.meta.url), "utf8");

  assert.match(source, /import ["']server-only["']/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_/);
});
