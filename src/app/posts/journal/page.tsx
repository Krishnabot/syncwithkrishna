import { getPostsByCategory, paginate, sortPosts } from '@/lib/content';
import type { Metadata } from 'next';
import ArchiveView from '@/components/ArchiveView';

export default function JournalListPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(getPostsByCategory('journal'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return <ArchiveView title="Journals" posts={slice} order={order} basePath="/posts/journal" currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Journals',
  description: 'Journal entries in chronological order',
  alternates: { canonical: '/posts/journal' },
  openGraph: { title: 'Journals', description: 'Journal entries in chronological order', url: '/posts/journal' },
};
