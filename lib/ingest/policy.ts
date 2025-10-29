import { uploadFile } from '@/lib/storage/upload';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { Buffer } from 'buffer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const ingestPolicy = async (file: File, policyTitle: string, category?: string) => {
  const user = await getSessionUser();
  if (!user || !['Admin', 'HR'].includes(user.role)) {
    throw new Error('Unauthorized');
  }
  const path = await uploadFile(file, 'policies');
  const buffer = Buffer.from(await file.arrayBuffer());
  let parsedText = '';
  if (file.type === 'application/pdf') {
    try {
      const parsed = await pdfParse(buffer);
      parsedText = parsed.text.slice(0, 4000);
    } catch (error) {
      console.warn('Failed to parse PDF for policy ingestion', error);
    }
  }
  const supabase = createSupabaseServerClient();
  const { data: policy } = await supabase
    .from('policies')
    .insert({ title: policyTitle, category, created_by: user.id })
    .select()
    .single();
  if (!policy) {
    throw new Error('Failed to create policy');
  }
  await supabase.from('policy_versions').insert({
    policy_id: policy.id,
    version: 1,
    storage_path: path,
    parsed_text: parsedText,
    created_by: user.id,
  });
  return { id: policy.id, path };
};
