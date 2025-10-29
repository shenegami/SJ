import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { z } from 'zod';

export const taskInputSchema = z.object({
  title: z.string().min(3),
  project_id: z.string().uuid(),
  due_date: z.string().optional(),
  assignee_id: z.string().uuid().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

export const listTasks = async () => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');

  let query = supabase
    .from('tasks')
    .select('id, title, status, priority, progress, due_date, assignee_id, project_id, projects(name)')
    .order('created_at', { ascending: false });

  if (user.role === 'Employee') {
    query = query.eq('assignee_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const createTask = async (payload: TaskInput) => {
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  if (!['Admin', 'HR', 'Manager'].includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('tasks').insert({
    title: payload.title,
    project_id: payload.project_id,
    due_date: payload.due_date ? payload.due_date : null,
    assignee_id: payload.assignee_id,
    priority: payload.priority,
    created_by: user.id,
  });
  if (error) throw error;
};
