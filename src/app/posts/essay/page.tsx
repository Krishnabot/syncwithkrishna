import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';

export default function EssayListPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('essay'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Essays</h1>
        <SortDropdown order={order} basePath="/posts/essay" />
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/posts/essay" query={{ sort: order }} />
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Essays',
  description: 'Essays exploring ideas and reflections',
  alternates: { canonical: '/posts/essay' },
  openGraph: { title: 'Essays', description: 'Essays exploring ideas and reflections', url: '/posts/essay' },
};
