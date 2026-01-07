import { getSortedPostsData, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
type PageParams = { page: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export default async function AllPostsPage({ params }: { params: PageParams | Promise<PageParams> }) {
  const p = isPromise<PageParams>(params) ? await params : params;
  const page = Number(p.page) || 1;
  const posts = getSortedPostsData();
  const { slice, totalPages } = paginate(posts, page, 12);
  return (
    <div>
      <h1 className="page-title">All Posts</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/posts" />
    </div>
  );
}
