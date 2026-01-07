import { dbGetPostBySlug } from '@/lib/sqlite';
import PostEditor from '@/components/admin/PostEditor';

type Params = { slug: string } | Promise<{ slug: string }>;
function isPromise<T>(obj: unknown): obj is Promise<T> { return !!obj && typeof (obj as { then?: unknown }).then === 'function'; }

export default async function EditPostPage({ params }: { params: Params }) {
  const p = isPromise(params) ? await params : params;
  const post = await dbGetPostBySlug(p.slug);
  if (!post) return <div className="muted">Not found</div>;
  return <PostEditor post={post} />;
}
