import { getSortedPostsData, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
type PageParams = { page: string };

export default async function AllPostsPage({ params, searchParams }: { params: Promise<PageParams>, searchParams: Promise<{ sort?: string }> }) {
  const [p, query] = await Promise.all([params, searchParams]);
  const page = Number(p.page) || 1;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(getSortedPostsData(), order);
  const { slice, totalPages } = paginate(posts, page, 12);
  return <ArchiveView title="All Posts" posts={slice} order={order} basePath="/posts" currentPage={page} totalPages={totalPages} />;
}
