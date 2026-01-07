import Link from 'next/link';
import { format } from 'date-fns';
import type { Post } from '@/lib/content';
import { BookOpen, PenTool, Feather, Calendar, Tag, ArrowRight } from 'lucide-react';

const categoryIcons = {
  journal: BookOpen,
  essay: PenTool,
  poem: Feather,
};

const categoryColors = {
  journal: {
    bg: 'bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
    border: 'border-purple-200 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-300',
    hover: 'hover:shadow-purple-lg',
    icon: 'text-purple-600 dark:text-purple-400',
    title: 'text-purple-900 dark:text-purple-100',
    subtitle: 'text-purple-700 dark:text-purple-300',
  },
  essay: {
    bg: 'bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30',
    border: 'border-violet-200 dark:border-violet-700',
    text: 'text-violet-700 dark:text-violet-300',
    hover: 'hover:shadow-violet-glow',
    icon: 'text-violet-600 dark:text-violet-400',
    title: 'text-violet-900 dark:text-violet-100',
    subtitle: 'text-violet-700 dark:text-violet-300',
  },
  poem: {
    bg: 'bg-gradient-to-r from-purple-200 to-violet-200 dark:from-purple-800/30 dark:to-violet-800/30',
    border: 'border-purple-300 dark:border-purple-600',
    text: 'text-purple-800 dark:text-purple-200',
    hover: 'hover:shadow-purple-xl',
    icon: 'text-purple-700 dark:text-purple-300',
    title: 'text-purple-900 dark:text-purple-100',
    subtitle: 'text-purple-700 dark:text-purple-300',
  },
};

export default function PostCard({ post }: { post: Post }) {
  const Icon = categoryIcons[post.category];
  const colors = categoryColors[post.category];

  return (
    <article className={`group relative p-6 rounded-2xl border ${colors.bg} ${colors.border} ${colors.hover} transition-all duration-300 hover:-translate-y-1`}>
      <Link href={`/posts/${post.category}/${post.slug}`} className="block h-full">
        {/* Category badge with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${colors.icon}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}>
              {post.category}
            </span>
          </div>
          <time className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400">
            <Calendar className="w-3 h-3" />
            {format(new Date(post.date), 'MMM d, yyyy')}
          </time>
        </div>

        {/* Title with gradient effect */}
        <h3 className={`text-xl font-bold mb-3 ${colors.title} group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-violet-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className={`${colors.subtitle} mb-4 line-clamp-3 leading-relaxed`}>
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-white/60 dark:bg-black/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/60 dark:bg-black/20 text-purple-600 dark:text-purple-400">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read more indicator */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-purple-200/30 dark:border-purple-700/30">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
            Read more
          </span>
          <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-all duration-300" />
        </div>
      </Link>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </article>
  );
}