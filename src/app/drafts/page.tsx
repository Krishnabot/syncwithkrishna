import { getDraftPosts, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { notFound } from 'next/navigation';

export default function DraftsPage({ searchParams }: { searchParams?: { sort?: string; page?: string } }) {
  if (process.env.NODE_ENV !== 'development') notFound();
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const page = Number(searchParams?.page || '1') || 1;
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

