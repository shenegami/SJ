import { NextRequest, NextResponse } from 'next/server';
import { ingestSalaryWorkbook } from '@/lib/ingest/salary';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const title = formData.get('title');

  if (!(file instanceof File) || typeof title !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const result = await ingestSalaryWorkbook(file, title);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
