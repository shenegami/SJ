import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { z } from 'zod';

export const policyInputSchema = z.object({
  title: z.string().min(3),
  category: z.string().optional(),
});

export const uploadInputSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size / (1024 * 1024) <= Number(process.env.MAX_UPLOAD_MB ?? 50), 'File too large'),
});

export const listPolicies = async () => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('policies')
    .select('id, title, category, is_active, policy_versions(id, version, created_at)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};
