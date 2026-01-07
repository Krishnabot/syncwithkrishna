import type { Post } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import SortDropdown from '@/components/SortDropdown';

export default function ArchiveView({
  title,
  posts,
  order,
  basePath,
  currentPage,
  totalPages,
}: {
  title: string;
  posts: Post[];
  order: 'asc' | 'desc';
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">{title}</h1>
        <SortDropdown order={order} basePath={basePath} />
      </div>
      <div className="grid-cards">
        {posts.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} query={{ sort: order }} />
    </div>
  );
}

