import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const email = process.env.HR_EMAIL!;
const password = process.env.HR_PASSWORD!;

const client = createClient(url, serviceKey);

async function main() {
  await client.from('roles').insert([{ id: 'HR' }], { upsert: true });
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'HR User' },
  });
  if (error && error.message !== 'User already registered') {
    throw error;
  }
  const authId = data?.user?.id ?? (await getAuthUserId(email));
  if (!authId) throw new Error('Unable to find auth id');
  await client.from('users').upsert({
    auth_user_id: authId,
    email,
    full_name: 'HR User',
    role: 'HR',
    is_active: true,
  });
  console.log('HR user ensured.');
}

async function getAuthUserId(target: string) {
  const { data } = await client.auth.admin.listUsers();
  return data.users.find((user) => user.email === target)?.id ?? null;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
