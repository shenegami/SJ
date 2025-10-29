'use server';

import { createUser, userInputSchema } from '@/lib/admin/users';

export const createUserAction = async (formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = userInputSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid user details.' };
  }
  try {
    await createUser(parsed.data);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};
