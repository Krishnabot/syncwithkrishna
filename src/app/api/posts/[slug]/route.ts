import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { dbGetPost, dbUpsertPost, dbDeletePost } from '@/lib/sqlite';

type Params = { slug: string } | Promise<{ slug: string }>;
function isPromise<T>(obj: unknown): obj is Promise<T> { return !!obj && typeof (obj as { then?: unknown }).then === 'function'; }

export async function GET(_: Request, { params }: { params: Params }) {
  const p = isPromise(params) ? await params : params;
  const post = await dbGetPost('journal', p.slug) || await dbGetPost('essay', p.slug) || await dbGetPost('poem', p.slug);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const p = isPromise(params) ? await params : params;
  const body = await req.json();
  await dbUpsertPost({ ...body, slug: p.slug });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const p = isPromise(params) ? await params : params;
  await dbDeletePost(p.slug);
  return NextResponse.json({ ok: true });
}

