import { getPostsByCategoryAsync, paginate, sortPosts } from '@/lib/content';
import type { Metadata } from 'next';
import ArchiveView from '@/components/ArchiveView';

export default async function EssayListPage({ searchParams }: { searchParams?: { sort?: string } }) {
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = sortPosts(await getPostsByCategoryAsync('essay'), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  return <ArchiveView title="Essays" posts={slice} order={order} basePath="/posts/essay" currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Essays',
  description: 'Essays exploring ideas and reflections',
  alternates: { canonical: '/posts/essay' },
  openGraph: { title: 'Essays', description: 'Essays exploring ideas and reflections', url: '/posts/essay' },
};
