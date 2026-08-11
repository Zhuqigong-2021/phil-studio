update public.tools
set
  aliases = case id
    when 'ap' then array['portfolio', 'art portfolio']
    when 'cv' then array['resume', 'résumé']
    when 'ps' then array['photoshop', 'photo editor']
    when 'pdf' then array['pdf editor', 'pdf tool']
    when 'am' then array['whiteboard animation', 'video maker']
    when 'mm' then array['mind map', 'brainstorm']
    when 'sm' then array['exam prep', 'study assistant']
    when 'no' then array['notes', 'knowledge base']
    when 'ai' then array['agent notes', 'ai learning']
    else aliases
  end,
  updated_at = now()
where id in ('ap', 'cv', 'ps', 'pdf', 'am', 'mm', 'sm', 'no', 'ai')
  and cardinality(aliases) = 0;
