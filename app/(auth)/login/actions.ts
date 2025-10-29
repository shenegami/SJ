'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signIn = async (formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid credentials supplied.' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
};
