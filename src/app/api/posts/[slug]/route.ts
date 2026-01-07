import { dbGetPostBySlug, dbUpsertPost, dbDeletePost } from '@/lib/sqlite';
import { json, adminOnly, readJson, normalizePostInput } from '@/lib/api';

type Params = { slug: string } | Promise<{ slug: string }>;
function isPromise<T>(obj: unknown): obj is Promise<T> { return !!obj && typeof (obj as { then?: unknown }).then === 'function'; }

export async function GET(_: Request, { params }: { params: Params }) {
  const p = isPromise(params) ? await params : params;
  const post = await dbGetPostBySlug(p.slug);
  if (!post) return json({ error: 'Not found' }, 404);
  return json(post);
}

export async function PUT(req: Request, { params }: { params: Params }) {
  return adminOnly(async () => {
    const p = isPromise(params) ? await params : params;
    const body = await readJson<Record<string, unknown>>(req);
    const post = normalizePostInput({ ...body, slug: p.slug });
    await dbUpsertPost(post);
    return json({ ok: true });
  });
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  return adminOnly(async () => {
    const p = isPromise(params) ? await params : params;
    await dbDeletePost(p.slug);
    return json({ ok: true });
  });
}
