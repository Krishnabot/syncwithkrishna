import { getAllTagsAsync, getPostsByTagAsync, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
import type { Metadata } from 'next';
type TagParams = { tag: string };

export async function generateStaticParams() {
  const tags = await getAllTagsAsync();
  return tags.map(({ tag }) => ({ tag }));
}

export default async function TagPage({ params, searchParams }: { params: Promise<TagParams>, searchParams: Promise<{ sort?: string }> }) {
  const [p, query] = await Promise.all([params, searchParams]);
  const tag = decodeURIComponent(p.tag);
  const order = query.sort === 'asc' ? 'asc' : 'desc';
  const posts = sortPosts(await getPostsByTagAsync(tag), order);
  const { slice, totalPages } = paginate(posts, 1, 9);
  
  return <ArchiveView title={`Tag: ${tag}`} posts={slice} order={order} basePath={`/tags/${encodeURIComponent(tag)}`} currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Tag Archive',
  description: 'Browse posts by tag',
};
