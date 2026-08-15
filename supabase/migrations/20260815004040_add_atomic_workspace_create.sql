create or replace function public.create_workspace_tool(
  p_owner_email text,
  p_tool jsonb,
  p_category_ids uuid[]
)
returns public.tools
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_tool public.tools;
  v_category_ids uuid[] := coalesce(p_category_ids, '{}'::uuid[]);
  v_category_count integer;
begin
  if p_owner_email is null or p_owner_email <> lower(btrim(p_owner_email)) then
    raise exception 'Invalid workspace owner.';
  end if;

  if p_tool is null or jsonb_typeof(p_tool) <> 'object' then
    raise exception 'Invalid workspace tool.';
  end if;

  if exists (
    select 1
    from jsonb_object_keys(p_tool) as tool_key
    where tool_key not in (
      'id', 'name', 'url', 'description', 'mono', 'icon_key', 'icon_type',
      'icon_color', 'aliases', 'source_type', 'is_favorite', 'is_pinned',
      'last_used_at', 'use_count', 'check_status', 'check_color',
      'last_checked_at', 'visible', 'sort_order'
    )
  ) then
    raise exception 'Unsupported tool create field.';
  end if;

  if nullif(btrim(p_tool ->> 'id'), '') is null
    or nullif(btrim(p_tool ->> 'name'), '') is null
    or nullif(btrim(p_tool ->> 'mono'), '') is null
    or nullif(btrim(p_tool ->> 'icon_color'), '') is null
    or nullif(btrim(p_tool ->> 'source_type'), '') is null then
    raise exception 'Invalid workspace tool.';
  end if;

  select count(*)
  into v_category_count
  from public.categories
  where owner_email = p_owner_email
    and id = any(v_category_ids);

  if v_category_count <> cardinality(v_category_ids)
    or v_category_count <> (
      select count(distinct category_id)
      from unnest(v_category_ids) as category_id
    ) then
    raise exception 'Invalid workspace category relationship.';
  end if;

  insert into public.tools (
    id, owner_email, name, url, description, mono, icon_key, icon_type,
    icon_color, aliases, source_type, is_favorite, is_pinned, last_used_at,
    use_count, check_status, check_color, last_checked_at, visible, sort_order
  ) values (
    p_tool ->> 'id',
    p_owner_email,
    p_tool ->> 'name',
    p_tool ->> 'url',
    coalesce(p_tool ->> 'description', ''),
    p_tool ->> 'mono',
    p_tool ->> 'icon_key',
    coalesce(p_tool ->> 'icon_type', 'monogram'),
    p_tool ->> 'icon_color',
    case when p_tool ? 'aliases'
      then array(select jsonb_array_elements_text(p_tool -> 'aliases'))
      else '{}'::text[]
    end,
    p_tool ->> 'source_type',
    coalesce((p_tool ->> 'is_favorite')::boolean, false),
    coalesce((p_tool ->> 'is_pinned')::boolean, false),
    (p_tool ->> 'last_used_at')::timestamptz,
    coalesce((p_tool ->> 'use_count')::integer, 0),
    coalesce(p_tool ->> 'check_status', 'Unknown'),
    coalesce(p_tool ->> 'check_color', '#7C8698'),
    (p_tool ->> 'last_checked_at')::timestamptz,
    coalesce((p_tool ->> 'visible')::boolean, true),
    coalesce((p_tool ->> 'sort_order')::integer, 0)
  )
  returning * into v_tool;

  insert into public.tool_categories (tool_id, category_id)
  select v_tool.id, category_id
  from unnest(v_category_ids) as category_id;

  return v_tool;
end;
$$;

revoke all on function public.create_workspace_tool(text, jsonb, uuid[])
  from public, anon, authenticated;
grant execute on function public.create_workspace_tool(text, jsonb, uuid[])
  to service_role;
