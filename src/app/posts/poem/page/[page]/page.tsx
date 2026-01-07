import { getPostsByCategory, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export default function PoemListPage({ params }: { params: { page: string } }) {
  const page = Number(params.page) || 1;
  const posts = getPostsByCategory('poem');
  const { slice, totalPages } = paginate(posts, page, 9);
  return (
    <div>
      <h1 className="page-title">Poems</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/posts/poem" />
    </div>
  );
}
