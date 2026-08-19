import { getPostsByCategoryAsync, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';

export default async function JournalListPage({ params, searchParams }: { params: Promise<{ page: string }>, searchParams: Promise<{ sort?: string }> }) {
  const [route, query] = await Promise.all([params, searchParams]);
  const page = Number(route.page) || 1;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(await getPostsByCategoryAsync('journal'), order);
  const { slice, totalPages } = paginate(posts, page, 9);
  return <ArchiveView title="Journals" posts={slice} order={order} basePath="/posts/journal" currentPage={page} totalPages={totalPages} />;
}
