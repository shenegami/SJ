import { NextRequest, NextResponse } from 'next/server';
import { listTasks, taskInputSchema, createTask } from '@/lib/tasks/queries';

export async function GET() {
  try {
    const tasks = await listTasks();
    return NextResponse.json({ data: tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const parsed = taskInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    await createTask(parsed.data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
