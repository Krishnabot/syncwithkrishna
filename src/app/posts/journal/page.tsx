import { getSortedPostsData } from '@/lib/content';
import Link from 'next/link';
import { format } from 'date-fns';

export default function JournalListPage() {
  const posts = getSortedPostsData().filter((p) => p.category === 'journal');
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Journals</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link
              href={`/posts/journal/${post.slug}`}
              className="block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-blue-600">Journal</span>
                <span className="text-gray-400">•</span>
                <time className="text-sm text-gray-500">
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

