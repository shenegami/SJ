import { uploadFile } from '@/lib/storage/upload';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/get-session-user';
import { Buffer } from 'buffer';
import * as XLSX from 'xlsx';

export const ingestSalaryWorkbook = async (file: File, title: string) => {
  const user = await getSessionUser();
  if (!user || !['Admin', 'HR'].includes(user.role)) {
    throw new Error('Unauthorized');
  }
  const path = await uploadFile(file, 'salary');
  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const schema = {
    sheet: sheetName,
    columns: Object.keys(rows[0] ?? {}),
  };

  if (rows.length === 0) {
    throw new Error('Salary workbook does not contain any rows to ingest');
  }

  const supabase = createSupabaseServerClient();
  const { data: source } = await supabase
    .from('salary_sources')
    .insert({
      title,
      storage_path: path,
      parsed_schema: schema,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (!source) {
    throw new Error('Failed to create salary source');
  }

  const normalized = rows.slice(0, 20).map((row) => ({
    source_id: source.id,
    job_title: String(row['Job Title'] ?? row['Title'] ?? ''),
    grade: (row['Grade'] as string) ?? null,
    step: (row['Step'] as string) ?? null,
    base_min: row['Min'] ? Number(row['Min']) : null,
    base_max: row['Max'] ? Number(row['Max']) : null,
    allowance: row['Allowance'] ? { general: row['Allowance'] } : null,
    exp_years_min: row['Experience Min'] ? Number(row['Experience Min']) : null,
    exp_years_max: row['Experience Max'] ? Number(row['Experience Max']) : null,
  }));

  if (normalized.length > 0) {
    await supabase.from('salary_entries').insert(normalized);
  }

  return { id: source.id, path };
};
