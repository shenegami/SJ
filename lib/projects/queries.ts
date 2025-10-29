import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { z } from 'zod';

export const projectInputSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const listProjects = async () => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  let query = supabase
    .from('projects')
    .select('id, name, description, status, start_date, due_date, progress, manager_id, tags')
    .order('created_at', { ascending: false });

  if (user.role === 'Employee') {
    const { data: assignedProjects } = await supabase
      .from('tasks')
      .select('project_id')
      .eq('assignee_id', user.id);
    const projectIds = Array.from(
      new Set((assignedProjects ?? []).map((task) => task.project_id).filter((id): id is string => Boolean(id))),
    );
    if (projectIds.length > 0) {
      query = query.in('id', projectIds as string[]);
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data ?? [];
};

export const createProject = async (payload: ProjectInput) => {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!['Admin', 'HR', 'Manager'].includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('projects').insert({
    name: payload.name,
    description: payload.description ?? null,
    due_date: payload.due_date ? payload.due_date : null,
    created_by: user.id,
    manager_id: user.role === 'Manager' ? user.id : null,
  });
  if (error) {
    throw error;
  }
};
