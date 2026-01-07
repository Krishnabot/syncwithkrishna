import { getPostsByCategory, paginate } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export default function JournalListPage({ params }: { params: { page: string } }) {
  const page = Number(params.page) || 1;
  const posts = getPostsByCategory('journal');
  const { slice, totalPages } = paginate(posts, page, 9);
  return (
    <div>
      <h1 className="page-title">Journals</h1>
      <div className="grid-cards">
        {slice.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} basePath="/posts/journal" />
    </div>
  );
}
