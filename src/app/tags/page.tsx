import { getAllTagsAsync } from '@/lib/content';
import Link from 'next/link';

export default async function TagsIndexPage() {
  const tags = await getAllTagsAsync();
  return (
    <div>
      <h1 className="page-title">Tags</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
            {tag} ({count})
          </Link>
        ))}
      </div>
    </div>
  );
}
