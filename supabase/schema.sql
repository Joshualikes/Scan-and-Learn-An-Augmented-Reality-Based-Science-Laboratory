-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  fullname text not null,
  role text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'Student' where role is distinct from 'Admin';
alter table public.profiles
  add constraint profiles_role_check check (role in ('Admin', 'Student'));

create table if not exists public.lab_login_secrets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  password text not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.lab_login_secrets enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id and role in ('Admin', 'Student'));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role in ('Admin', 'Student'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role text;
begin
  chosen_role := coalesce(new.raw_user_meta_data->>'role', 'Student');
  if chosen_role is distinct from 'Admin' then
    chosen_role := 'Student';
  end if;

  insert into public.profiles (id, username, fullname, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'fullname', ''),
    chosen_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Confirm any leftover Auth users from failed email signups.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null;

-- Username-only register that does not send Supabase emails (avoids rate limits).
create or replace function public.register_lab_user(
  p_fullname text,
  p_username text,
  p_password text,
  p_role text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_local text;
  v_email text;
  v_fullname text;
  v_role text;
  v_user_id uuid;
begin
  v_fullname := trim(coalesce(p_fullname, ''));
  v_local := lower(trim(coalesce(p_username, '')));
  v_local := regexp_replace(v_local, '[^a-z0-9._-]+', '.', 'g');
  v_local := regexp_replace(v_local, '^\.+|\.+$', '', 'g');
  v_role := case when trim(coalesce(p_role, '')) = 'Admin' then 'Admin' else 'Student' end;

  if v_fullname = '' then
    raise exception 'Full name is required.';
  end if;
  if v_local = '' then
    raise exception 'Enter a valid username.';
  end if;
  if length(coalesce(p_password, '')) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  v_email := v_local || '@cabcabenlab.com';

  if exists (select 1 from public.profiles where lower(username) = lower(trim(p_username)))
     or exists (select 1 from auth.users where email = v_email) then
    raise exception 'Username is already taken.' using errcode = '23505';
  end if;

  v_user_id := gen_random_uuid();

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'username', trim(p_username),
      'fullname', v_fullname,
      'role', v_role
    ),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', v_email,
      'email_verified', true
    ),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, username, fullname, role)
  values (v_user_id, trim(p_username), v_fullname, v_role)
  on conflict (id) do update
    set username = excluded.username,
        fullname = excluded.fullname,
        role = excluded.role;

  insert into public.lab_login_secrets (user_id, password, updated_at)
  values (v_user_id, p_password, now())
  on conflict (user_id) do update
    set password = excluded.password,
        updated_at = now();

  return v_user_id;
end;
$$;

revoke all on function public.register_lab_user(text, text, text, text) from public;
grant execute on function public.register_lab_user(text, text, text, text) to anon, authenticated;

create or replace function public.sync_profiles_from_auth()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  u record;
  v_username text;
  v_role text;
begin
  for u in select id, email, raw_user_meta_data, created_at from auth.users loop
    v_username := coalesce(
      nullif(trim(u.raw_user_meta_data->>'username'), ''),
      split_part(coalesce(u.email, ''), '@', 1),
      replace(u.id::text, '-', '')
    );
    v_role := case
      when coalesce(u.raw_user_meta_data->>'role', '') = 'Admin' then 'Admin'
      else 'Student'
    end;

    begin
      insert into public.profiles (id, username, fullname, role, created_at)
      values (
        u.id,
        v_username,
        coalesce(u.raw_user_meta_data->>'fullname', ''),
        v_role,
        coalesce(u.created_at, now())
      )
      on conflict (id) do update
        set username = coalesce(nullif(trim(public.profiles.username), ''), excluded.username),
            fullname = coalesce(nullif(trim(public.profiles.fullname), ''), excluded.fullname);
    exception
      when unique_violation then
        insert into public.profiles (id, username, fullname, role, created_at)
        values (
          u.id,
          v_username || '-' || substr(replace(u.id::text, '-', ''), 1, 6),
          coalesce(u.raw_user_meta_data->>'fullname', ''),
          v_role,
          coalesce(u.created_at, now())
        )
        on conflict (id) do nothing;
    end;
  end loop;
end;
$$;

create or replace function public.ensure_own_profile()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_id uuid := auth.uid();
  v_email text;
  v_meta jsonb;
  v_created timestamptz;
  v_username text;
  v_role text;
begin
  if v_id is null then
    return;
  end if;

  select email, raw_user_meta_data, created_at
    into v_email, v_meta, v_created
  from auth.users
  where id = v_id;

  if not found then
    return;
  end if;

  v_username := coalesce(
    nullif(trim(v_meta->>'username'), ''),
    split_part(coalesce(v_email, ''), '@', 1),
    replace(v_id::text, '-', '')
  );
  v_role := case
    when coalesce(v_meta->>'role', '') = 'Admin' then 'Admin'
    else 'Student'
  end;

  begin
    insert into public.profiles (id, username, fullname, role, created_at)
    values (
      v_id,
      v_username,
      coalesce(v_meta->>'fullname', ''),
      v_role,
      coalesce(v_created, now())
    )
    on conflict (id) do update
      set username = coalesce(nullif(trim(public.profiles.username), ''), excluded.username),
          fullname = coalesce(nullif(trim(public.profiles.fullname), ''), excluded.fullname);
  exception
    when unique_violation then
      insert into public.profiles (id, username, fullname, role, created_at)
      values (
        v_id,
        v_username || '-' || substr(replace(v_id::text, '-', ''), 1, 6),
        coalesce(v_meta->>'fullname', ''),
        v_role,
        coalesce(v_created, now())
      )
      on conflict (id) do nothing;
  end;
end;
$$;

revoke all on function public.ensure_own_profile() from public;
grant execute on function public.ensure_own_profile() to authenticated;

create or replace function public.is_lab_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    exists (
      select 1 from public.profiles
      where id = auth.uid() and lower(trim(role)) = 'admin'
    )
    or (
      auth.uid() is not null
      and not exists (select 1 from public.profiles where id = auth.uid())
      and exists (
        select 1 from auth.users
        where id = auth.uid()
          and coalesce(raw_user_meta_data->>'role', '') = 'Admin'
      )
    );
$$;

revoke all on function public.is_lab_admin() from public;
grant execute on function public.is_lab_admin() to authenticated;

drop policy if exists "Admins can view student profiles" on public.profiles;
create policy "Admins can view student profiles"
  on public.profiles
  for select
  using (public.is_lab_admin() and lower(trim(role)) is distinct from 'admin');

create or replace function public.list_student_logins()
returns table (
  id uuid,
  username text,
  fullname text,
  password text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.ensure_own_profile();
  perform public.sync_profiles_from_auth();

  if not public.is_lab_admin() then
    raise exception 'Only administrators can view student accounts.';
  end if;

  return query
  select
    p.id,
    p.username,
    p.fullname,
    coalesce(s.password, ''),
    p.created_at
  from public.profiles p
  left join public.lab_login_secrets s on s.user_id = p.id
  where lower(trim(p.role)) is distinct from 'admin'
  order by p.created_at desc;
end;
$$;

revoke all on function public.list_student_logins() from public;
grant execute on function public.list_student_logins() to authenticated;

create or replace function public.reset_student_password(p_user_id uuid, p_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.is_lab_admin() then
    raise exception 'Only administrators can reset student passwords.';
  end if;
  if length(coalesce(p_password, '')) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = p_user_id and lower(trim(role)) is distinct from 'admin'
  ) then
    raise exception 'Student account not found.';
  end if;

  update auth.users
  set encrypted_password = crypt(p_password, gen_salt('bf')),
      updated_at = now()
  where id = p_user_id;

  insert into public.lab_login_secrets (user_id, password, updated_at)
  values (p_user_id, p_password, now())
  on conflict (user_id) do update
    set password = excluded.password,
        updated_at = now();
end;
$$;

revoke all on function public.reset_student_password(uuid, text) from public;
grant execute on function public.reset_student_password(uuid, text) to authenticated;

create or replace function public.delete_student_account(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_lab_admin() then
    raise exception 'Only administrators can delete student accounts.';
  end if;
  if p_user_id is null then
    raise exception 'Student account not found.';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'You cannot delete the account you are using.';
  end if;
  if exists (
    select 1 from public.profiles
    where id = p_user_id and lower(trim(role)) = 'admin'
  ) then
    raise exception 'Admin accounts cannot be deleted here.';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id)
     and not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'Student account not found.';
  end if;

  delete from public.lab_login_secrets where user_id = p_user_id;
  delete from public.profiles where id = p_user_id;
  delete from auth.identities where user_id = p_user_id;

  -- Auth tables mix uuid and varchar user_id columns across GoTrue versions.
  -- Compare as text so delete does not fail with "operator does not exist: character varying = uuid".
  begin
    delete from auth.mfa_amr_claims
    where session_id in (
      select id from auth.sessions where user_id::text = p_user_id::text
    );
  exception
    when undefined_table then null;
    when undefined_column then null;
  end;
  begin
    delete from auth.sessions where user_id::text = p_user_id::text;
  exception
    when undefined_table then null;
    when undefined_column then null;
  end;
  begin
    delete from auth.refresh_tokens where user_id::text = p_user_id::text;
  exception
    when undefined_table then null;
    when undefined_column then null;
  end;
  begin
    delete from auth.mfa_factors where user_id::text = p_user_id::text;
  exception
    when undefined_table then null;
    when undefined_column then null;
  end;
  begin
    delete from auth.one_time_tokens where user_id::text = p_user_id::text;
  exception
    when undefined_table then null;
    when undefined_column then null;
  end;

  delete from auth.users where id = p_user_id;
end;
$$;

revoke all on function public.delete_student_account(uuid) from public;
grant execute on function public.delete_student_account(uuid) to authenticated;

create or replace function public.store_own_login_password(p_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Please log in first.';
  end if;
  if length(coalesce(p_password, '')) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;

  insert into public.lab_login_secrets (user_id, password, updated_at)
  values (auth.uid(), p_password, now())
  on conflict (user_id) do update
    set password = excluded.password,
        updated_at = now();
end;
$$;

revoke all on function public.store_own_login_password(text) from public;
grant execute on function public.store_own_login_password(text) to authenticated;

notify pgrst, 'reload schema';
