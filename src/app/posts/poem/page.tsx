import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';

export default function PoemListPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('poem'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Poems</h1>
        <SortDropdown order={order} basePath="/posts/poem" />
      </div>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/posts/poem" query={{ sort: order }} />
    </div>
  );
}
