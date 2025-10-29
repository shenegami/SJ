import { getSessionUser } from '@/lib/auth/get-session-user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { z } from 'zod';

export const userInputSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role: z.enum(['Admin', 'HR', 'Manager', 'Employee']),
});

export const listUsers = async () => {
  const supabase = createSupabaseServerClient();
  const actor = await getSessionUser();
  if (!actor || !['Admin', 'HR'].includes(actor.role)) {
    throw new Error('Forbidden');
  }
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, is_active, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const createUser = async (payload: z.infer<typeof userInputSchema>) => {
  const actor = await getSessionUser();
  if (!actor || !['Admin', 'HR'].includes(actor.role)) {
    throw new Error('Forbidden');
  }

  const serviceClient = getServiceRoleClient();
  const { data: authUser, error: authError } = await serviceClient.auth.admin.createUser({
    email: payload.email,
    email_confirm: true,
    password: Math.random().toString(36).slice(-12),
    user_metadata: { full_name: payload.full_name },
  });
  if (authError) throw authError;
  if (!authUser.user) throw new Error('Failed to create auth user');

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('users').insert({
    auth_user_id: authUser.user.id,
    email: payload.email,
    full_name: payload.full_name,
    role: payload.role,
  });
  if (error) throw error;
};
