with icon_mapping(id, icon_key) as (
  values
    ('ap', 'palette'),
    ('cv', 'contact'),
    ('ps', 'image'),
    ('pdf', 'file-text'),
    ('am', 'clapperboard'),
    ('mm', 'chart-network'),
    ('sm', 'graduation-cap'),
    ('no', 'book-open-text'),
    ('ai', 'brain-circuit')
)
update public.tools as tools
set icon_key = icon_mapping.icon_key,
    icon_type = 'matching',
    updated_at = now()
from icon_mapping
where tools.id = icon_mapping.id;
