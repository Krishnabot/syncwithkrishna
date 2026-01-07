import { getAllTagsAsync, getPostsByTagAsync, paginate, sortPosts } from '@/lib/content';
import ArchiveView from '@/components/ArchiveView';
import type { Metadata } from 'next';
type TagParams = { tag: string };
function isPromise<T>(obj: unknown): obj is Promise<T> {
  return !!obj && typeof (obj as { then?: unknown }).then === 'function';
}

export async function generateStaticParams() {
  const tags = await getAllTagsAsync();
  return tags.map(({ tag }) => ({ tag }));
}

export default async function TagPage({ params, searchParams }: { params: TagParams | Promise<TagParams>, searchParams?: { sort?: string } }) {
  const p = isPromise<TagParams>(params) ? await params : params;
  const tag = decodeURIComponent(p.tag);
  const order = (searchParams?.sort === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const posts = await getPostsByTagAsync(tag);
  const { slice, totalPages } = paginate(posts, 1, 9);
  
  return <ArchiveView title={`Tag: ${tag}`} posts={slice} order={order} basePath={`/tags/${encodeURIComponent(tag)}`} currentPage={1} totalPages={totalPages} />;
}

export const metadata: Metadata = {
  title: 'Tag Archive',
  description: 'Browse posts by tag',
};
