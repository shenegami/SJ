import { listUsers } from '@/lib/admin/users';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { redirect } from 'next/navigation';
import { AdminUsers } from '@/components/common/admin-users';

export default async function AdminPage() {
  const actor = await getSessionUser();
  if (!actor || !['Admin', 'HR'].includes(actor.role)) {
    redirect('/dashboard');
  }
  const users = await listUsers();
  return <AdminUsers users={users} />;
}
