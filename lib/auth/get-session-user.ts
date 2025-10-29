import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SessionUser } from '@/types/auth';

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, role, full_name')
    .eq('auth_user_id', session.user.id)
    .maybeSingle();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role as SessionUser['role'],
    full_name: user.full_name,
  };
};
