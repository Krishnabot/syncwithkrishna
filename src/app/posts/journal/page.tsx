import { getSortedPostsData } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';

export default function JournalListPage() {
  const posts = getSortedPostsData().filter((p) => p.category === 'journal');
  return (
    <div>
      <h1 className="page-title">Journals</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/journal/${post.slug}`} className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Journal</span>
                <span className="meta-sep">•</span>
                <time className="meta-time">
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <h2 className="card-title">
                {post.title}
              </h2>
              <p className="card-subtitle">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
