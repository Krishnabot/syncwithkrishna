import type { Post } from '@/lib/content';

export default function PostHeader({ post }: { post: Post }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
          {post.category}
        </span>
        <span className="meta-sep">•</span>
        <time className="meta-time">{new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      </div>
      <h1 className="page-title">{post.title}</h1>
      <div className="flex flex-wrap gap-2">
        {(post.tags || []).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

