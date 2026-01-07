import Link from 'next/link';
import { format } from 'date-fns';
import type { Post } from '@/lib/content';

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/posts/${post.category}/${post.slug}`} className="card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
            {post.category}
          </span>
          <span className="meta-sep">•</span>
          <time className="meta-time">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>
        </div>
        <h3 className="card-title">{post.title}</h3>
        <p className="card-subtitle">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </Link>
    </article>
  );
}

