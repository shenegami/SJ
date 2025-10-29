'use client';

import { createUserAction } from '@/app/(dashboard)/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInputSchema } from '@/lib/admin/users';
import { z } from 'zod';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const roles = ['Admin', 'HR', 'Manager', 'Employee'] as const;

type FormValues = z.infer<typeof userInputSchema>;

type AdminUsersProps = {
  users: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    is_active: boolean;
    created_at: string | null;
  }[];
};

export const AdminUsers = ({ users }: AdminUsersProps) => {
  const form = useForm<FormValues>({ resolver: zodResolver(userInputSchema) });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    startTransition(async () => {
      setError(null);
      const result = await createUserAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        toast.success('User created');
        router.refresh();
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-sm text-muted-foreground">Provision secure access for colleagues.</p>
      </div>
      <form className="rounded-lg border bg-card p-6 shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold">Invite user</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...form.register('email')} placeholder="person@company.com" />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <Input {...form.register('full_name')} placeholder="Full name" />
            {form.formState.errors.full_name && (
              <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <select
              {...form.register('role')}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="mt-4" disabled={isPending}>
          {isPending ? 'Creating…' : 'Create user'}
        </Button>
      </form>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2 font-medium">{user.full_name ?? '—'}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
