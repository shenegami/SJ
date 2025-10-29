import { NextRequest, NextResponse } from 'next/server';
import { suggestSalary } from '@/lib/salary/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobTitle = searchParams.get('title');
  if (!jobTitle) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 });
  }
  const years = searchParams.get('years');
  const data = await suggestSalary({ jobTitle, yearsOfExperience: years ? Number(years) : undefined });
  return NextResponse.json({ data });
}
