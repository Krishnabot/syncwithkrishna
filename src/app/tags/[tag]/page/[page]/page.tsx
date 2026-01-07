import { getPostsByTag, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
type TagPageParams = { tag: string; page: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export default async function TagPage({ params }: { params: TagPageParams | Promise<TagPageParams> }) {
  const p = isPromise<TagPageParams>(params) ? await params : params;
  const tag = decodeURIComponent(p.tag);
  const page = Number(p.page) || 1;
  const posts = getPostsByTag(tag);
  const { slice, totalPages } = paginate(posts, page, 9);

  return (
    <div>
      <h1 className="page-title">Tag: {tag}</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath={`/tags/${encodeURIComponent(tag)}`} />
    </div>
  );
}
