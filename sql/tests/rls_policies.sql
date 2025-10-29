-- Example RLS validation script (execute with Supabase SQL editor)
-- Admin context
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- Replace the UUIDs above with auth user ids that map to Admin/HR/Manager/Employee before running.
-- 1. Admin can read all users
select count(*) from public.users;

-- Employee context
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- 2. Employee can only see own user row
select * from public.users;

-- 3. Employee cannot insert into projects
insert into public.projects(name) values ('Forbidden project');

-- 4. Manager can insert projects
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000003', true);
insert into public.projects(name) values ('Manager project');

reset all;
