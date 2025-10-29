-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Roles
create table if not exists public.roles (
  id text primary key check (id in ('Admin','HR','Manager','Employee'))
);

insert into public.roles(id) values ('Admin'),('HR'),('Manager'),('Employee')
on conflict do nothing;

-- Users
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique not null,
  email text unique not null,
  full_name text,
  role text not null references public.roles(id) default 'Employee',
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  manager_id uuid references public.users(id),
  status text not null default 'active',
  start_date date,
  due_date date,
  progress numeric default 0,
  tags text[],
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  assignee_id uuid references public.users(id),
  status text not null default 'todo',
  priority text default 'normal',
  due_date date,
  progress numeric default 0,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Attachments
create table if not exists public.attachments (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null check (entity_type in ('project','task','policy')),
  entity_id uuid not null,
  file_path text not null,
  mime_type text,
  uploaded_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Policies
create table if not exists public.policies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text,
  is_active boolean default true,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Policy versions
create table if not exists public.policy_versions (
  id uuid primary key default uuid_generate_v4(),
  policy_id uuid references public.policies(id) on delete cascade,
  version int not null,
  storage_path text not null,
  parsed_text text,
  created_by uuid references public.users(id),
  created_at timestamptz default now(),
  unique(policy_id, version)
);

-- Salary sources
create table if not exists public.salary_sources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  storage_path text not null,
  parsed_schema jsonb,
  is_active boolean default true,
  uploaded_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- Salary entries
create table if not exists public.salary_entries (
  id uuid primary key default uuid_generate_v4(),
  source_id uuid references public.salary_sources(id) on delete cascade,
  job_title text,
  grade text,
  step text,
  base_min numeric,
  base_max numeric,
  allowance jsonb,
  exp_years_min int,
  exp_years_max int
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  source_type text not null check (source_type in ('policy','salary','other')),
  source_id uuid,
  title text,
  language text default 'auto',
  created_at timestamptz default now()
);

-- Document chunks
create table if not exists public.document_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references public.documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb,
  created_at timestamptz default now(),
  unique (document_id, chunk_index)
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.users(id),
  action text not null,
  entity text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- Sync helper
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.attachments enable row level security;
alter table public.policies enable row level security;
alter table public.policy_versions enable row level security;
alter table public.salary_sources enable row level security;
alter table public.salary_entries enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.audit_logs enable row level security;

-- Helper to fetch role
create or replace function public.current_user_role()
returns text as $$
declare
  current_role text;
begin
  select role into current_role from public.users where auth_user_id = auth.uid();
  return current_role;
end;
$$ language plpgsql stable security definer;

-- Users policies
create policy "Users self access" on public.users
  for select using (auth.uid() = auth_user_id);

create policy "Users admin hr read" on public.users
  for select using (public.current_user_role() in ('Admin','HR'));

create policy "Users admin manage" on public.users
  for insert with check (public.current_user_role() = 'Admin');

create policy "Users admin update" on public.users
  for update using (public.current_user_role() = 'Admin')
  with check (public.current_user_role() = 'Admin');

-- Projects policies
create policy "Projects read" on public.projects
  for select using (
    public.current_user_role() in ('Admin','HR','Manager')
    or id in (
      select project_id from public.tasks where assignee_id = (select id from public.users where auth_user_id = auth.uid())
    )
  );

create policy "Projects admin write" on public.projects
  for all using (public.current_user_role() in ('Admin','HR','Manager'))
  with check (public.current_user_role() in ('Admin','HR','Manager'));

-- Tasks policies
create policy "Tasks read" on public.tasks
  for select using (
    public.current_user_role() in ('Admin','HR','Manager')
    or assignee_id = (select id from public.users where auth_user_id = auth.uid())
  );

create policy "Tasks write" on public.tasks
  for all using (public.current_user_role() in ('Admin','HR','Manager'))
  with check (public.current_user_role() in ('Admin','HR','Manager'));

-- Attachments policies
create policy "Attachments read" on public.attachments
  for select using (
    public.current_user_role() in ('Admin','HR','Manager')
    or (
      entity_type = 'task' and entity_id in (select id from public.tasks where assignee_id = (select id from public.users where auth_user_id = auth.uid()))
    )
    or (
      entity_type = 'project' and entity_id in (
        select project_id from public.tasks where assignee_id = (select id from public.users where auth_user_id = auth.uid())
      )
    )
  );

create policy "Attachments write" on public.attachments
  for insert with check (public.current_user_role() in ('Admin','HR','Manager'));

-- Policies
create policy "Policies read" on public.policies
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Policies write" on public.policies
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

create policy "Policy versions read" on public.policy_versions
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Policy versions write" on public.policy_versions
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

-- Salary data
create policy "Salary sources read" on public.salary_sources
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Salary sources write" on public.salary_sources
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

create policy "Salary entries read" on public.salary_entries
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Salary entries write" on public.salary_entries
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

-- Document access
create policy "Documents read" on public.documents
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Documents write" on public.documents
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

create policy "Chunks read" on public.document_chunks
  for select using (exists(select 1 from public.users where auth_user_id = auth.uid() and is_active));

create policy "Chunks write" on public.document_chunks
  for all using (public.current_user_role() in ('Admin','HR'))
  with check (public.current_user_role() in ('Admin','HR'));

-- Audit logs
create policy "Audit logs read" on public.audit_logs
  for select using (public.current_user_role() = 'Admin');

create policy "Audit logs insert" on public.audit_logs
  for insert with check (true);
