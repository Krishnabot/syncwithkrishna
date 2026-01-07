import { getSortedPostsData, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';

export default function AllPostsPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getSortedPostsData(), order);
  const { slice, totalPages } = paginate(posts, 1, 12);
  return <ArchiveView title="All Posts" posts={slice} order={order} basePath="/posts" currentPage={1} totalPages={totalPages} />;
}
