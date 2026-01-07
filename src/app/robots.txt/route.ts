import { NextResponse } from 'next/server';

function siteUrl() {
  return process.env.SITE_URL || 'http://localhost:3000';
}

export const revalidate = 3600;
export const dynamic = 'force-static';

export async function GET() {
  const url = siteUrl();
  const body = `User-agent: *
Allow: /
Sitemap: ${url}/sitemap.xml
`;
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } });
}

