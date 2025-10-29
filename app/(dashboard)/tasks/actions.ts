'use server';

import { createTask, taskInputSchema } from '@/lib/tasks/queries';

export const createTaskAction = async (formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = taskInputSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid task details.' };
  }
  try {
    await createTask(parsed.data);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
};
