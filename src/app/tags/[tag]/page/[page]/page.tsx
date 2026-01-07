import { getPostsByTag, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
type TagPageParams = { tag: string; page: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export default async function TagPage({ params, searchParams }: { params: TagPageParams | Promise<TagPageParams>, searchParams?: { sort?: string } }) {
  const p = isPromise<TagPageParams>(params) ? await params : params;
  const tag = decodeURIComponent(p.tag);
  const page = Number(p.page) || 1;
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByTag(tag), order);
  const { slice, totalPages } = paginate(posts, page, 9);
  
  return <ArchiveView title={`Tag: ${tag}`} posts={slice} order={order} basePath={`/tags/${encodeURIComponent(tag)}`} currentPage={page} totalPages={totalPages} />;
}
