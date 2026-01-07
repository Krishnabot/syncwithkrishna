import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import type { Metadata } from 'next';
import ArchiveView from '@/components/ArchiveView';

export default function PoemListPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('poem'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return <ArchiveView title="Poems" posts={slice} order={order} basePath="/posts/poem" currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Poems',
  description: 'Poetry collection — verses and stanzas',
  alternates: { canonical: '/posts/poem' },
  openGraph: { title: 'Poems', description: 'Poetry collection — verses and stanzas', url: '/posts/poem' },
};
