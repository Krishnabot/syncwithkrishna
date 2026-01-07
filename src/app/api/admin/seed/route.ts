import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getSortedPostsDataIncludeDrafts } from '@/lib/content';
import type { Post } from '@/lib/content';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { dbUpsertPost } from '@/lib/sqlite';

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const seedsDir = path.join(process.cwd(), 'seeds/posts');
  let posts = getSortedPostsDataIncludeDrafts();
  if (fs.existsSync(seedsDir)) {
    const categories = ['journals', 'essays', 'poems'];
    const collected: Post[] = [];
    categories.forEach((cat) => {
      const categoryPath = path.join(seedsDir, cat);
      if (fs.existsSync(categoryPath)) {
        const fileNames = fs.readdirSync(categoryPath);
        fileNames.forEach((fileName) => {
          if (fileName.endsWith('.md')) {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(categoryPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const m = matter(fileContents);
            collected.push({
              slug,
              title: m.data.title,
              date: m.data.date,
              category: cat.slice(0, -1) as Post['category'],
              tags: m.data.tags || [],
              excerpt: m.data.excerpt || '',
              content: m.content,
              draft: !!m.data.draft,
            });
          }
        });
      }
    });
    if (collected.length) posts = collected;
  }
  for (const p of posts) {
    await dbUpsertPost({
      slug: p.slug,
      title: p.title,
      date: p.date,
      category: p.category,
      tags: p.tags || [],
      excerpt: p.excerpt || '',
      content: p.content,
      draft: !!p.draft,
    });
  }
  return NextResponse.json({ ok: true, seeded: posts.length });
}
