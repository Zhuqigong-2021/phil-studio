alter table public.tools
  drop constraint if exists tools_icon_color_check;

alter table public.tools
  add constraint tools_icon_color_check check (
    icon_color in ('violet', 'blue', 'pink', 'orange', 'cyan', 'teal', 'slate')
    or icon_color ~ '^#[0-9A-F]{6}$'
  );
