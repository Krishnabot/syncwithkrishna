import { getSortedPostsData, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
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
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">All Posts</h1>
        <SortDropdown order={order} basePath="/posts" />
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/posts" query={{ sort: order }} />
    </div>
  );
}
