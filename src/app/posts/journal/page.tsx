import { getPostsByCategoryAsync, paginate, sortPosts } from '@/lib/content';
import type { Metadata } from 'next';
import ArchiveView from '@/components/ArchiveView';

export default async function JournalListPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const query = await searchParams;
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(await getPostsByCategoryAsync('journal'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return <ArchiveView title="Journals" posts={slice} order={order} basePath="/posts/journal" currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Journals',
  description: 'Journal entries in chronological order',
  alternates: { canonical: '/posts/journal' },
  openGraph: { title: 'Journals', description: 'Journal entries in chronological order', url: '/posts/journal' },
};
