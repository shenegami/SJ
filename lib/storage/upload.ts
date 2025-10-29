import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { randomUUID } from 'crypto';

export const uploadFile = async (file: File, folder: string) => {
  const client = getServiceRoleClient();
  const arrayBuffer = await file.arrayBuffer();
  const path = `${folder}/${randomUUID()}-${file.name}`;
  const { error } = await client.storage.from(process.env.STORAGE_BUCKET ?? 'company-assistant').upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    throw error;
  }
  return path;
};
