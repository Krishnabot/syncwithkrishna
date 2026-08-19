import { getPostsByTagAsync, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
type TagPageParams = { tag: string; page: string };

export default async function TagPage({ params, searchParams }: { params: Promise<TagPageParams>, searchParams: Promise<{ sort?: string }> }) {
  const [p, query] = await Promise.all([params, searchParams]);
  const tag = decodeURIComponent(p.tag);
  const page = Number(p.page) || 1;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(await getPostsByTagAsync(tag), order);
  const { slice, totalPages } = paginate(posts, page, 9);
  
  return <ArchiveView title={`Tag: ${tag}`} posts={slice} order={order} basePath={`/tags/${encodeURIComponent(tag)}`} currentPage={page} totalPages={totalPages} />;
}
