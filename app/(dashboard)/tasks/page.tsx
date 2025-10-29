import { listTasks } from '@/lib/tasks/queries';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TasksBoard } from '@/components/common/tasks-board';

export default async function TasksPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const supabase = createSupabaseServerClient();
  const [tasks, projects, people] = await Promise.all([
    listTasks(),
    supabase.from('projects').select('id,name'),
    supabase.from('users').select('id,full_name,email'),
  ]);

  return (
    <TasksBoard
      tasks={tasks}
      projects={projects.data ?? []}
      people={people.data ?? []}
      role={user.role}
    />
  );
}
