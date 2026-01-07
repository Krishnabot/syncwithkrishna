import { NextResponse } from 'next/server';
export const revalidate = 3600;
export const dynamic = 'force-static';
import { getSortedPostsData } from '@/lib/content';

function siteUrl() {
  return process.env.SITE_URL || 'http://localhost:3000';
}

export async function GET() {
  const posts = getSortedPostsData();
  const url = siteUrl();
  const items = posts
    .map((p) => {
      const link = `${url}/posts/${p.category}/${p.slug}`;
      return `
        <item>
          <title><![CDATA[${p.title}]]></title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <pubDate>${new Date(p.date).toUTCString()}</pubDate>
          <description><![CDATA[${p.excerpt}]]></description>
          ${(p.tags || [])
            .map((t) => `<category><![CDATA[${t}]]></category>`)
            .join('')}
        </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Personal Blog</title>
      <link>${url}</link>
      <description>Latest posts</description>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
