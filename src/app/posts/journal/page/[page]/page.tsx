import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';

export default function JournalListPage({ params, searchParams }: { params: { page: string }, searchParams?: { sort?: string } }) {
  const page = Number(params.page) || 1;
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('journal'), order);
  const { slice, totalPages } = paginate(posts, page, 9);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Journals</h1>
        <SortDropdown order={order} basePath="/posts/journal" />
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/posts/journal" query={{ sort: order }} />
    </div>
  );
}
