import { getSortedPostsData, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';

export default async function AllPostsPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const query = await searchParams;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(getSortedPostsData(), order);
  const { slice, totalPages } = paginate(posts, 1, 12);
  return <ArchiveView title="All Posts" posts={slice} order={order} basePath="/posts" currentPage={1} totalPages={totalPages} />;
}
