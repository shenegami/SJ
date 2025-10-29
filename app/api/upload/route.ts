import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/storage/upload';
import { getSessionUser } from '@/lib/auth/get-session-user';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !['Admin', 'HR', 'Manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  try {
    const path = await uploadFile(file, 'uploads');
    return NextResponse.json({ path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
