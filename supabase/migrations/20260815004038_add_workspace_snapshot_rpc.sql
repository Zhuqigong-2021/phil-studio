create or replace function public.get_workspace_snapshot(
  p_owner_email text
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_owner_email is null or p_owner_email <> lower(btrim(p_owner_email)) then
    raise exception 'Invalid workspace owner.';
  end if;

  return jsonb_build_object(
    'tools', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.sort_order, t.id)
      from public.tools t
      where t.owner_email = p_owner_email
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(to_jsonb(c) order by c.sort_order, c.id)
      from public.categories c
      where c.owner_email = p_owner_email
    ), '[]'::jsonb),
    'relationships', coalesce((
      select jsonb_agg(to_jsonb(tc) order by tc.tool_id, tc.category_id)
      from public.tool_categories tc
      join public.tools t on t.id = tc.tool_id
      join public.categories c on c.id = tc.category_id
      where t.owner_email = p_owner_email
        and c.owner_email = p_owner_email
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_workspace_snapshot(text)
  from public, anon, authenticated;
grant execute on function public.get_workspace_snapshot(text)
  to service_role;
