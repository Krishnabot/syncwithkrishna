import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { dbGetPosts, dbUpsertPost } from '@/lib/sqlite';

export async function GET() {
  const posts = await dbGetPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  await dbUpsertPost(body);
  return NextResponse.json({ ok: true });
}

