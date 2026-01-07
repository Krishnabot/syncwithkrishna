import { getSortedPostsData, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export default function AllPostsPage() {
  const posts = getSortedPostsData();
  const { slice, totalPages } = paginate(posts, 1, 12);
  return (
    <div>
      <h1 className="page-title">All Posts</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      <Pagination currentPage={1} totalPages={totalPages} basePath="/posts" />
    </div>
  );
}

