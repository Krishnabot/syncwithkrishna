import { dbGetPost } from '@/lib/sqlite';
import Editor from './render';

type Params = { slug: string } | Promise<{ slug: string }>;
function isPromise<T>(obj: unknown): obj is Promise<T> { return !!obj && typeof (obj as { then?: unknown }).then === 'function'; }

export default async function EditPostPage({ params }: { params: Params }) {
  const p = isPromise(params) ? await params : params;
  const post = await dbGetPost('journal', p.slug) || await dbGetPost('essay', p.slug) || await dbGetPost('poem', p.slug);
  if (!post) return <div className="muted">Not found</div>;
  return <Editor post={post} />;
}

