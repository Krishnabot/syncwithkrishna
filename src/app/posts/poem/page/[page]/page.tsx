import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';

export default function PoemListPage({ params, searchParams }: { params: { page: string }, searchParams?: { sort?: string } }) {
  const page = Number(params.page) || 1;
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('poem'), order);
  const { slice, totalPages } = paginate(posts, page, 9);
  return <ArchiveView title="Poems" posts={slice} order={order} basePath="/posts/poem" currentPage={page} totalPages={totalPages} />;
}
