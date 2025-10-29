import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';

export const listSalarySources = async () => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  const { data, error } = await supabase
    .from('salary_sources')
    .select('id, title, parsed_schema, is_active, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const suggestSalary = async (params: {
  jobTitle: string;
  yearsOfExperience?: number;
}) => {
  const supabase = createSupabaseServerClient();
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');

  const { data } = await supabase
    .from('salary_entries')
    .select('job_title, base_min, base_max, allowance, source_id, salary_sources(title)')
    .ilike('job_title', `%${params.jobTitle}%`)
    .limit(10);

  return data ?? [];
};
