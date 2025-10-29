import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { SessionUser } from '@/types/auth';

export type DashboardMetrics = {
  activeProjects: number;
  overdueTasks: number;
  tasksByStatus: Record<string, number>;
  recentPolicyUpdates: { id: string; title: string; version: number; created_at: string }[];
};

const allowedTaskStatuses = ['todo', 'in_progress', 'blocked', 'done', 'deferred'];

const canReadAllProjects = (role: SessionUser['role']) => ['Admin', 'HR', 'Manager'].includes(role);

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const projectQuery = supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'active');
  if (!canReadAllProjects(user.role)) {
    projectQuery.eq('manager_id', user.id);
  }
  const { count: activeProjects = 0 } = await projectQuery;

  const now = new Date().toISOString().split('T')[0];
  const taskQuery = supabase
    .from('tasks')
    .select('id,status,due_date,assignee_id', { count: 'exact', head: false })
    .not('due_date', 'is', null);

  const { data: tasks } = await taskQuery;

  const overdueTasks = (tasks ?? []).filter((task) => {
    if (!task.due_date) return false;
    const due = new Date(task.due_date);
    return due < new Date(now);
  }).length;

  const tasksByStatus: Record<string, number> = Object.fromEntries(allowedTaskStatuses.map((status) => [status, 0]));
  (tasks ?? []).forEach((task) => {
    if (task.status in tasksByStatus) {
      tasksByStatus[task.status] += 1;
    }
  });

  const { data: recentPolicyUpdates } = await supabase
    .from('policy_versions')
    .select('id, version, created_at, policies(title)')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    activeProjects: activeProjects ?? 0,
    overdueTasks,
    tasksByStatus,
    recentPolicyUpdates:
      recentPolicyUpdates?.map((item) => ({
        id: item.id,
        title: (item as any).policies?.title ?? 'Policy',
        version: item.version,
        created_at: item.created_at ?? '',
      })) ?? [],
  };
};
