import { AppShell } from '@/components/layout/app-shell';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return <AppShell role={user.role}>{children}</AppShell>;
}
