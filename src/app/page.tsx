import { getSortedPostsDataAsync } from '@/lib/content';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default async function Home() {
  const allPosts = await getSortedPostsDataAsync();
  const recentPosts = allPosts.slice(0, 6);

  return (
    <div>
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
        <h2 className="section-title">Latest Posts</h2>
        <div className="grid-cards">
          {recentPosts.map((post) => (
            <PostCard key={`${post.category}-${post.slug}`} post={post} />
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
