import type { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/content';

function siteUrl() {
  return process.env.SITE_URL || 'http://localhost:3000';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  const base = [
    { url: `${url}/`, lastModified: new Date() },
    { url: `${url}/posts`, lastModified: new Date() },
    { url: `${url}/posts/journal`, lastModified: new Date() },
    { url: `${url}/posts/essay`, lastModified: new Date() },
    { url: `${url}/posts/poem`, lastModified: new Date() },
    { url: `${url}/tags`, lastModified: new Date() },
  ];
  const posts = getSortedPostsData().map((p) => ({
    url: `${url}/posts/${p.category}/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...base, ...posts];
}

