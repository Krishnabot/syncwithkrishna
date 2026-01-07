import { getSortedPostsData } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PoemListPage() {
  const posts = getSortedPostsData().filter((p) => p.category === 'poem');
  return (
    <div>
      <h1 className="page-title">Poems</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/posts/poem/${post.slug}`} className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-600">Poem</span>
                <span className="text-gray-400">•</span>
                <time className="text-sm text-gray-500">
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
