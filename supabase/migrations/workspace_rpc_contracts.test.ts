import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const snapshotSql = readFileSync(new URL("./20260815004038_add_workspace_snapshot_rpc.sql", import.meta.url), "utf8");
const createSql = readFileSync(new URL("./20260815004040_add_atomic_workspace_create.sql", import.meta.url), "utf8");

test("snapshot RPC is caller-scoped, deterministic, and always returns JSON arrays", () => {
  assert.match(snapshotSql, /get_workspace_snapshot\(\s*p_owner_email text\s*\)\s*returns jsonb/i);
  assert.match(snapshotSql, /language plpgsql\s+security invoker\s+set search_path = ''/i);
  assert.doesNotMatch(snapshotSql, /security definer/i);
  assert.match(snapshotSql, /where t\.owner_email = p_owner_email/i);
  assert.match(snapshotSql, /where c\.owner_email = p_owner_email/i);
  assert.match(snapshotSql, /order by t\.sort_order, t\.id/i);
  assert.match(snapshotSql, /order by c\.sort_order, c\.id/i);
  assert.match(snapshotSql, /order by tc\.tool_id, tc\.category_id/i);
  assert.ok((snapshotSql.match(/coalesce\([\s\S]*?'\[\]'::jsonb\)/gi) ?? []).length >= 3);
});

test("snapshot relationships are constrained through owner-scoped tools and categories", () => {
  assert.match(snapshotSql, /join public\.tools t on t\.id = tc\.tool_id[\s\S]*join public\.categories c on c\.id = tc\.category_id/i);
  assert.match(snapshotSql, /t\.owner_email = p_owner_email[\s\S]*c\.owner_email = p_owner_email/i);
});

test("atomic create validates all input and category ownership before inserting", () => {
  assert.match(createSql, /create_workspace_tool\(\s*p_owner_email text,\s*p_tool jsonb,\s*p_category_ids uuid\[\]\s*\)\s*returns public\.tools/i);
  assert.match(createSql, /language plpgsql\s+security invoker\s+set search_path = ''/i);
  assert.doesNotMatch(createSql, /security definer/i);

  const ownerValidation = createSql.indexOf("Invalid workspace owner.");
  const fieldValidation = createSql.indexOf("Unsupported tool create field.");
  const categoryValidation = createSql.indexOf("Invalid workspace category relationship.");
  const insert = createSql.indexOf("insert into public.tools");
  assert.ok(ownerValidation >= 0 && ownerValidation < insert);
  assert.ok(fieldValidation >= 0 && fieldValidation < insert);
  assert.ok(categoryValidation >= 0 && categoryValidation < insert);
  assert.match(createSql, /where owner_email = p_owner_email\s+and id = any\(v_category_ids\)/i);
  assert.match(createSql, /count\(distinct category_id\)\s+from unnest\(v_category_ids\)/i);
});

test("tool and relationship creation share one transaction with no compensation path", () => {
  assert.match(createSql, /insert into public\.tools[\s\S]*insert into public\.tool_categories/i);
  assert.doesNotMatch(createSql, /\bcommit\b|\brollback\b|delete from public\.tools/i);
});

test("only service_role can execute the new RPCs", () => {
  for (const [sql, signature] of [
    [snapshotSql, "get_workspace_snapshot\\(text\\)"],
    [createSql, "create_workspace_tool\\(text, jsonb, uuid\\[\\]\\)"],
  ] as const) {
    assert.match(sql, new RegExp(`revoke all on function public\\.${signature}[\\s\\S]*?from public, anon, authenticated;`, "i"));
    assert.match(sql, new RegExp(`grant execute on function public\\.${signature}[\\s\\S]*?to service_role;`, "i"));
  }
});
