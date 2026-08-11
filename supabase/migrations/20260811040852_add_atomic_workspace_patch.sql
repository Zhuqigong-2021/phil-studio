create or replace function public.patch_workspace_tool(
  p_owner_email text,
  p_tool_id text,
  p_patch jsonb default '{}'::jsonb,
  p_category_ids uuid[] default null,
  p_increment_use boolean default false,
  p_used_at timestamptz default null
)
returns public.tools
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_tool public.tools;
  v_category_count integer;
begin
  if p_owner_email is null or p_owner_email <> lower(btrim(p_owner_email)) then
    raise exception 'Invalid workspace owner.';
  end if;

  if exists (
    select 1
    from jsonb_object_keys(p_patch) as patch_key
    where patch_key not in (
      'name', 'url', 'description', 'icon_key', 'icon_color', 'aliases',
      'source_type', 'is_favorite', 'is_pinned', 'visible'
    )
  ) then
    raise exception 'Unsupported tool patch field.';
  end if;

  select *
  into v_tool
  from public.tools
  where id = p_tool_id
    and owner_email = p_owner_email
  for update;

  if not found then
    return null;
  end if;

  if p_category_ids is not null then
    select count(*)
    into v_category_count
    from public.categories
    where owner_email = p_owner_email
      and id = any(p_category_ids);

    if v_category_count <> cardinality(p_category_ids)
      or v_category_count <> (
        select count(distinct category_id)
        from unnest(p_category_ids) as category_id
      ) then
      raise exception 'Invalid workspace category relationship.';
    end if;
  end if;

  update public.tools
  set
    name = case when p_patch ? 'name' then p_patch ->> 'name' else name end,
    url = case when p_patch ? 'url' then p_patch ->> 'url' else url end,
    description = case when p_patch ? 'description' then p_patch ->> 'description' else description end,
    icon_key = case when p_patch ? 'icon_key' then p_patch ->> 'icon_key' else icon_key end,
    icon_color = case when p_patch ? 'icon_color' then p_patch ->> 'icon_color' else icon_color end,
    aliases = case
      when p_patch ? 'aliases'
        then array(select jsonb_array_elements_text(p_patch -> 'aliases'))
      else aliases
    end,
    source_type = case when p_patch ? 'source_type' then p_patch ->> 'source_type' else source_type end,
    is_favorite = case when p_patch ? 'is_favorite' then (p_patch ->> 'is_favorite')::boolean else is_favorite end,
    is_pinned = case when p_patch ? 'is_pinned' then (p_patch ->> 'is_pinned')::boolean else is_pinned end,
    visible = case when p_patch ? 'visible' then (p_patch ->> 'visible')::boolean else visible end,
    last_used_at = case when p_increment_use then coalesce(p_used_at, now()) else last_used_at end,
    use_count = use_count + case when p_increment_use then 1 else 0 end,
    updated_at = now()
  where id = p_tool_id
    and owner_email = p_owner_email
  returning * into v_tool;

  if p_category_ids is not null then
    delete from public.tool_categories
    where tool_id = p_tool_id;

    insert into public.tool_categories (tool_id, category_id)
    select p_tool_id, category_id
    from unnest(p_category_ids) as category_id;
  end if;

  return v_tool;
end;
$$;

revoke all on function public.patch_workspace_tool(text, text, jsonb, uuid[], boolean, timestamptz)
  from public, anon, authenticated;
grant execute on function public.patch_workspace_tool(text, text, jsonb, uuid[], boolean, timestamptz)
  to service_role;
