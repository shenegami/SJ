import { NextRequest, NextResponse } from 'next/server';
import { listProjects, projectInputSchema, createProject } from '@/lib/projects/queries';

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ data: projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = projectInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    await createProject(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
