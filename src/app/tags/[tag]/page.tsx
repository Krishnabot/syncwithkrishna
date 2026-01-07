import { getAllTags, getPostsByTag, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
type TagParams = { tag: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export default async function TagPage({ params }: { params: TagParams | Promise<TagParams> }) {
  const p = isPromise<TagParams>(params) ? await params : params;
  const tag = decodeURIComponent(p.tag);
  const posts = getPostsByTag(tag);
  const { slice, totalPages } = paginate(posts, 1, 9);

  return (
    <div>
      <h1 className="page-title">Tag: {tag}</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath={`/tags/${encodeURIComponent(tag)}`} />
  </div>
);
}
