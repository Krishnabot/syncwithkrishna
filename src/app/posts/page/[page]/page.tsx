import { getSortedPostsData, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
type PageParams = { page: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export default async function AllPostsPage({ params, searchParams }: { params: PageParams | Promise<PageParams>, searchParams?: { sort?: string } }) {
  const p = isPromise<PageParams>(params) ? await params : params;
  const page = Number(p.page) || 1;
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getSortedPostsData(), order);
  const { slice, totalPages } = paginate(posts, page, 12);
  return <ArchiveView title="All Posts" posts={slice} order={order} basePath="/posts" currentPage={page} totalPages={totalPages} />;
}
