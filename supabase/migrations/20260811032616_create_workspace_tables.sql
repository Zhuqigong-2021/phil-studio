create table public.tools (
  id text primary key,
  owner_email text not null check (owner_email = lower(btrim(owner_email)) and length(owner_email) > 3),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  url text,
  description text not null default '' check (char_length(description) <= 160),
  mono text not null,
  icon_key text,
  icon_type text not null default 'monogram' check (icon_type in ('official', 'matching', 'monogram')),
  icon_color text not null check (icon_color in ('violet', 'blue', 'pink', 'orange', 'cyan', 'teal', 'slate')),
  aliases text[] not null default '{}',
  source_type text not null check (source_type in ('internal', 'external')),
  is_favorite boolean not null default false,
  is_pinned boolean not null default false,
  last_used_at timestamptz,
  use_count integer not null default 0 check (use_count >= 0),
  check_status text not null default 'Unknown',
  check_color text not null default '#7C8698',
  last_checked_at timestamptz,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null check (owner_email = lower(btrim(owner_email)) and length(owner_email) > 3),
  name text not null check (char_length(btrim(name)) between 1 and 24),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tool_categories (
  tool_id text not null references public.tools(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tool_id, category_id)
);

create unique index categories_owner_name_ci
  on public.categories (owner_email, lower(name));
create index tools_owner_sort on public.tools (owner_email, sort_order);
create index tools_owner_recent on public.tools (owner_email, last_used_at desc nulls last);
create index tool_categories_category on public.tool_categories (category_id);

alter table public.tools enable row level security;
alter table public.categories enable row level security;
alter table public.tool_categories enable row level security;

revoke all on public.tools, public.categories, public.tool_categories from anon, authenticated;
grant select, insert, update, delete on public.tools, public.categories, public.tool_categories to service_role;
