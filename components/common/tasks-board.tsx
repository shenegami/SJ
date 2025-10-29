'use client';

import { createTaskAction } from '@/app/(dashboard)/tasks/actions';
import type { Role } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/provider';
import { taskInputSchema } from '@/lib/tasks/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';

const columns = [
  { key: 'todo', title: 'To do' },
  { key: 'in_progress', title: 'In progress' },
  { key: 'blocked', title: 'Blocked' },
  { key: 'done', title: 'Done' },
  { key: 'deferred', title: 'Deferred' },
] as const;

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  progress: number | null;
  due_date: string | null;
  assignee_id: string | null;
  project_id: string | null;
  projects?: { name: string } | null;
};

type FormValues = z.infer<typeof taskInputSchema>;

export const TasksBoard = ({
  tasks,
  projects,
  people,
  role,
}: {
  tasks: Task[];
  projects: { id: string; name: string }[];
  people: { id: string; full_name: string | null; email: string }[];
  role: Role;
}) => {
  const { dir } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(taskInputSchema) });
  const router = useRouter();

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    startTransition(async () => {
      setError(null);
      const result = await createTaskAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success('Task created');
        router.refresh();
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6" dir={dir}>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted-foreground">Monitor assignments and unblock teams quickly.</p>
      </div>
      {['Admin', 'HR', 'Manager'].includes(role) && (
        <form className="rounded-lg border bg-card p-6 shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-lg font-semibold">Create Task</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input {...form.register('title')} placeholder="Review contract" />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <select
                {...form.register('project_id')}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.project_id && (
                <p className="text-xs text-destructive">{form.formState.errors.project_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <select
                {...form.register('assignee_id')}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Unassigned</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.full_name ?? person.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                {...form.register('priority')}
                defaultValue="normal"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" {...form.register('due_date')} />
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create task'}
          </Button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key);
          return (
            <div key={column.key} className="rounded-lg border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">{column.title}</h3>
              <div className="mt-3 space-y-2">
                {columnTasks.map((task) => (
                  <div key={task.id} className="rounded border bg-muted/50 p-3">
                    <div className="text-sm font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {task.projects?.name ?? 'Unassigned project'}
                    </div>
                    <div className="mt-1 text-xs">
                      Priority: <span className="font-semibold capitalize">{task.priority ?? 'normal'}</span>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && (
                  <p className="text-xs text-muted-foreground">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
