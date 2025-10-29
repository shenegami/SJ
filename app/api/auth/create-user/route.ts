import { NextRequest, NextResponse } from 'next/server';
import { userInputSchema, createUser } from '@/lib/admin/users';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = userInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    await createUser(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
