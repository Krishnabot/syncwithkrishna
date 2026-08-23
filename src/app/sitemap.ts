import type { MetadataRoute } from 'next';

function siteUrl() {
  return process.env.SITE_URL || 'http://localhost:3000';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  return [{ url: `${url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}

