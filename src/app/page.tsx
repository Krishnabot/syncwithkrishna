import { getSortedPostsData } from '@/lib/content';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Home() {
  const allPosts = getSortedPostsData();
  const recentPosts = allPosts.slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="page-title">
          Welcome to my personal space
        </h1>
        <p className="page-subtitle">
          This is where I share my daily thoughts, reflections, and creative writing.
          You&apos;ll find journals documenting my journey, essays exploring ideas that matter,
          and poems capturing moments of beauty and introspection.
        </p>
      </section>

      {/* Recent Posts */}
      <section>
        <h2 className="section-title">Recent Posts</h2>
        <div className="space-y-8">
          {recentPosts.map((post) => (
            <article key={`${post.category}-${post.slug}`} className="group">
              <Link 
                href={`/posts/${post.category}/${post.slug}`}
                className="card"
                key={`${post.category}-${post.slug}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-blue-600 capitalize">
                    {post.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <time className="text-sm text-gray-500">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </time>
                </div>
                <h3 className="card-title">
                  {post.title}
                </h3>
                <p className="card-subtitle">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* View All Posts */}
      {allPosts.length > 5 && (
        <div className="mt-12 text-center">
          <Link href="/posts" className="btn btn-primary">
            View All Posts
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
