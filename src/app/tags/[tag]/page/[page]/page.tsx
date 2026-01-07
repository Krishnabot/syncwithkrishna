import { getPostsByTag, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
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
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Tag: {tag}</h1>
        <SortDropdown order={order} basePath={`/tags/${encodeURIComponent(tag)}`} />
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/tags/${encodeURIComponent(tag)}`} query={{ sort: order }} />
    </div>
  );
}
