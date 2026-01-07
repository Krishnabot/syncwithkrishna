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

export default function ContentRenderer({ source, isPoem }: { source: string; isPoem?: boolean }) {
  return (
    <div className={`prose-content ${isPoem ? 'poem-content' : ''}`}>
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
          },
        }}
        components={{ Callout, Quote, Divider, Button, Stanza, Line }}
      />
    </div>
  );
}

