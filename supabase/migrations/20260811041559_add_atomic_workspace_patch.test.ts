import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync(new URL("./20260811041559_add_atomic_workspace_patch.sql", import.meta.url), "utf8");

test("atomic update RPC runs with caller privileges and a closed search path", () => {
  assert.match(sql, /language plpgsql\s+security invoker\s+set search_path = ''/i);
  assert.doesNotMatch(sql, /security definer/i);
});

test("atomic update RPC validates owner and patch fields before mutation", () => {
  const ownerCheck = sql.indexOf("Invalid workspace owner.");
  const patchCheck = sql.indexOf("Unsupported tool patch field.");
  const update = sql.indexOf("update public.tools");

  assert.ok(ownerCheck >= 0 && ownerCheck < update);
  assert.ok(patchCheck >= 0 && patchCheck < update);
  assert.match(sql, /where id = p_tool_id\s+and owner_email = p_owner_email\s+for update/i);
});

test("category ownership and duplicate IDs are rejected before replacement", () => {
  const validation = sql.indexOf("Invalid workspace category relationship.");
  const relationshipDelete = sql.indexOf("delete from public.tool_categories");

  assert.ok(validation >= 0 && validation < relationshipDelete);
  assert.match(sql, /where owner_email = p_owner_email\s+and id = any\(p_category_ids\)/i);
  assert.match(sql, /count\(distinct category_id\)\s+from unnest\(p_category_ids\)/i);
});

test("tool update and category replacement share one function transaction", () => {
  assert.match(sql, /update public.tools[\s\S]*delete from public.tool_categories[\s\S]*insert into public.tool_categories/i);
  assert.equal((sql.match(/create or replace function/gi) ?? []).length, 1);
  assert.doesNotMatch(sql, /\bcommit\b|\brollback\b/i);
});

test("only service_role can execute the atomic update RPC", () => {
  assert.match(sql, /revoke all on function public\.patch_workspace_tool\([\s\S]*?from public, anon, authenticated;/i);
  assert.match(sql, /grant execute on function public\.patch_workspace_tool\([\s\S]*?to service_role;/i);
});
