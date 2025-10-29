'use client';

import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectAction } from '@/app/(dashboard)/projects/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n/provider';
import type { Role } from '@/components/layout/app-shell';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectInputSchema } from '@/lib/projects/queries';
import { z } from 'zod';
import { toast } from 'sonner';

const canCreate = (role: Role) => ['Admin', 'HR', 'Manager'].includes(role);

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  due_date: string | null;
  progress: number | null;
};

type FormValues = z.infer<typeof projectInputSchema>;

export const ProjectTable = ({ projects, role }: { projects: Project[]; role: Role }) => {
  const { dir } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({ resolver: zodResolver(projectInputSchema) });
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value as string);
    });
    startTransition(async () => {
      setError(null);
      const result = await createProjectAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success('Project created');
        router.refresh();
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6" dir={dir}>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-sm text-muted-foreground">Track active initiatives across the company.</p>
      </div>
      {canCreate(role) && (
        <form className="rounded-lg border bg-card p-6 shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-lg font-semibold">Create Project</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register('name')} placeholder="New product launch" />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due date</label>
              <Input type="date" {...form.register('due_date')} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input {...form.register('description')} placeholder="Summary" />
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create project'}
          </Button>
        </form>
      )}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="p-2">Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t">
                <td className="p-2 font-medium">{project.name}</td>
                <td className="p-2 capitalize">{project.status}</td>
                <td className="p-2">{project.progress ?? 0}%</td>
                <td className="p-2">{project.due_date ?? '—'}</td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
