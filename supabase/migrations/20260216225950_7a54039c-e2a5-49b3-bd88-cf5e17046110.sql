
-- Fix function search_path for event_trigger_fn (returns event_trigger, can't set search_path easily but let's fix it)
-- has_role already has search_path set in its definition, but the linter may see an old cached version
-- Let's recreate has_role with explicit search_path

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fix log_user_changes - add search_path
CREATE OR REPLACE FUNCTION public.log_user_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
begin
  if (TG_OP = 'INSERT') then
    insert into public.audit_logs (table_name, operation, record_id, new_data)
    values ('auth.users', 'INSERT', new.id, to_jsonb(new));
    return new;
  elsif (TG_OP = 'UPDATE') then
    insert into public.audit_logs (table_name, operation, record_id, old_data, new_data)
    values ('auth.users', 'UPDATE', new.id, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (TG_OP = 'DELETE') then
    insert into public.audit_logs (table_name, operation, record_id, old_data)
    values ('auth.users', 'DELETE', old.id, to_jsonb(old));
    return old;
  end if;
  return null;
end;
$function$;

-- Fix cron_cleanup - add search_path
CREATE OR REPLACE FUNCTION public.cron_cleanup(src_table text, timestamp_column text, older_than_days integer, action text DEFAULT 'delete'::text, archive_table text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
declare
  src_schema text;
  src_tbl text;
  ts_col text;
  arch_schema text;
  arch_table text;
  cutoff timestamptz := now() - make_interval(days => older_than_days);
  deleted_count bigint := 0;
  archived_count bigint := 0;
  src_qualified text;
  arch_qualified text;
  sql_cmd text;
  allow_rec record;
begin
  if older_than_days is null or older_than_days < 0 then
    raise exception 'older_than_days must be >= 0';
  end if;

  if position('.' in src_table) > 0 then
    src_schema := split_part(src_table, '.', 1);
    src_tbl := split_part(src_table, '.', 2);
  else
    src_schema := 'public';
    src_tbl := src_table;
  end if;

  ts_col := timestamp_column;

  if archive_table is not null and archive_table <> '' then
    if position('.' in archive_table) > 0 then
      arch_schema := split_part(archive_table, '.', 1);
      arch_table := split_part(archive_table, '.', 2);
    else
      arch_schema := src_schema;
      arch_table := archive_table;
    end if;
  end if;

  select * into allow_rec from public.cleanup_allowlist
    where table_schema = src_schema and table_name = src_tbl and timestamp_column = ts_col;
  if not found then
    raise exception 'Table %.% with timestamp column % is not allowlisted', src_schema, src_tbl, ts_col;
  end if;

  src_qualified := public.fq(src_schema, src_tbl);

  if action = 'archive' then
    if arch_schema is null then
      arch_schema := coalesce(allow_rec.archive_table_schema, src_schema);
      arch_table := coalesce(allow_rec.archive_table_name, src_tbl || '_archive');
    end if;
    arch_qualified := public.fq(arch_schema, arch_table);

    perform 1 from information_schema.tables
      where table_schema = arch_schema and table_name = arch_table;
    if not found then
      sql_cmd := format('create table %s (like %s including all);', arch_qualified, src_qualified);
      execute sql_cmd;
    end if;

    sql_cmd := format('insert into %s select * from %s where %I < $1', arch_qualified, src_qualified, ts_col);
    execute sql_cmd using cutoff;
    get diagnostics archived_count = row_count;

    sql_cmd := format('delete from %s where %I < $1', src_qualified, ts_col);
    execute sql_cmd using cutoff;
    get diagnostics deleted_count = row_count;

  elsif action = 'delete' then
    sql_cmd := format('delete from %s where %I < $1', src_qualified, ts_col);
    execute sql_cmd using cutoff;
    get diagnostics deleted_count = row_count;
  else
    raise exception 'Unknown action: %', action;
  end if;

  return jsonb_build_object(
    'table', src_qualified,
    'timestamp_column', ts_col,
    'cutoff', cutoff,
    'action', action,
    'archive_table', coalesce(arch_qualified, null),
    'archived_count', archived_count,
    'deleted_count', deleted_count
  );
end
$function$;

-- Fix fq function - add search_path
CREATE OR REPLACE FUNCTION public.fq(rel_schema text, rel_name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $function$
  select quote_ident(rel_schema) || '.' || quote_ident(rel_name)
$function$;
