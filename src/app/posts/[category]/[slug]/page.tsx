import { getPostData, getAllPostSlugs } from '@/lib/content';
import { format } from 'date-fns';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Callout from '@/components/mdx/Callout';
import Quote from '@/components/mdx/Quote';
import Divider from '@/components/mdx/Divider';
import Button from '@/components/mdx/Button';
import Stanza from '@/components/mdx/Stanza';
import Line from '@/components/mdx/Line';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getAllPostSlugs();
}

type Params = { category: string; slug: string } | Promise<{ category: string; slug: string }>;
function isPromise<T>(obj: unknown): obj is Promise<T> { return !!obj && typeof (obj as { then?: unknown }).then === 'function'; }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = isPromise(params) ? await params : params;
  const { category, slug } = p;
  const post = await getPostData(category, slug);
  const url = process.env.SITE_URL || 'http://localhost:3000';
  const canonical = `${url}/posts/${post.category}/${post.slug}`;
  const title = post.title;
  const description = post.excerpt;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: 'Personal Blog',
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPostData(category, slug);

  return (
    <>
      <article className="mb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
              {post.category}
            </span>
            <span className="meta-sep">•</span>
            <time className="meta-time">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
          </div>
          <h1 className="page-title">
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className={`prose-content ${post.category === 'poem' ? 'poem-content' : ''}`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                datePublished: new Date(post.date).toISOString(),
                dateModified: new Date(post.date).toISOString(),
                author: { '@type': 'Person', name: 'Krishna' },
                description: post.excerpt,
                keywords: (post.tags || []).join(', '),
                mainEntityOfPage: `${process.env.SITE_URL || 'http://localhost:3000'}/posts/${post.category}/${post.slug}`,
              }),
            }}
          />
          <MDXRemote 
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
              },
            }}
            components={{ Callout, Quote, Divider, Button, Stanza, Line }}
          />
        </div>
      </article>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium"
        >
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </>
  );
}
