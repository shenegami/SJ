'use server';

import { projectInputSchema, createProject } from '@/lib/projects/queries';

export const createProjectAction = async (formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = projectInputSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid project details.' };
  }
  try {
    await createProject(parsed.data);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};
