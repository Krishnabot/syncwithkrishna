import { getDraftPosts, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';

export default async function DraftsPage({ searchParams }: { searchParams: Promise<{ sort?: string; page?: string }> }) {
  if (process.env.NODE_ENV !== 'development') notFound();
  const query = await searchParams;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const page = Number(query.page || '1') || 1;
  const posts = sortPosts(getDraftPosts(), order);
  const { slice, totalPages } = paginate(posts, page, 12);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Drafts</h1>
        <span className="tag">Development only</span>
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/drafts" query={{ sort: order }} />
    </div>
  );
}

