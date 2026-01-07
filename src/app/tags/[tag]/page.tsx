import { getAllTags, getPostsByTag, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';
type TagParams = { tag: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export default async function TagPage({ params, searchParams }: { params: TagParams | Promise<TagParams>, searchParams?: { sort?: string } }) {
  const p = isPromise<TagParams>(params) ? await params : params;
  const tag = decodeURIComponent(p.tag);
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByTag(tag), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
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
      <Pagination currentPage={1} totalPages={totalPages} basePath={`/tags/${encodeURIComponent(tag)}`} query={{ sort: order }} />
    </div>
  );
}
