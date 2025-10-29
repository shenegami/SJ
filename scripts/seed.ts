import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminEmail = process.env.ADMIN_EMAIL!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const hrEmail = process.env.HR_EMAIL!;
const hrPassword = process.env.HR_PASSWORD!;

const client = createClient(url, serviceKey);

async function seed() {
  console.log('Seeding roles...');
  await client.from('roles').insert([{ id: 'Admin' }, { id: 'HR' }, { id: 'Manager' }, { id: 'Employee' }], {
    upsert: true,
  });

  console.log('Creating admin user...');
  await createUser(adminEmail, adminPassword, 'Admin User', 'Admin');
  console.log('Creating HR user...');
  await createUser(hrEmail, hrPassword, 'HR User', 'HR');

  console.log('Inserting demo project...');
  const admin = await getUserByEmail(adminEmail);
  if (admin) {
    await client.from('projects').insert({
      name: 'AI Rollout',
      description: 'Enterprise deployment of the AI Company Assistant.',
      created_by: admin.id,
      manager_id: admin.id,
    });
  }

  console.log('Seed complete.');
}

async function createUser(email: string, password: string, fullName: string, role: string) {
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error && error.message !== 'User already registered') {
    throw error;
  }
  const authId = data?.user?.id ?? (await getAuthUserId(email));
  if (!authId) throw new Error(`Failed to determine auth id for ${email}`);
  await client.from('users').upsert({
    auth_user_id: authId,
    email,
    full_name: fullName,
    role,
    is_active: true,
  });
}

async function getAuthUserId(email: string) {
  const { data } = await client.auth.admin.listUsers();
  return data.users.find((user) => user.email === email)?.id ?? null;
}

async function getUserByEmail(email: string) {
  const { data } = await client.from('users').select('*').eq('email', email).maybeSingle();
  return data;
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
