import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function readJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Response('Invalid JSON', { status: 400 });
  }
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function adminOnly<T>(handler: () => Promise<NextResponse>) {
  const email = await requireAdmin();
  if (!email) return error('Unauthorized', 401);
  return handler();
}

export function normalizePostInput(input: any) {
  const category = String(input.category);
  if (!['journal', 'essay', 'poem'].includes(category)) {
    throw new Response('Invalid category', { status: 400 });
  }
  return {
    slug: String(input.slug),
    title: String(input.title),
    date: String(input.date),
    category: category as 'journal' | 'essay' | 'poem',
    tags: Array.isArray(input.tags) ? input.tags.map((t: any) => String(t)) : [],
    excerpt: String(input.excerpt ?? ''),
    content: String(input.content ?? ''),
    draft: !!input.draft,
  };
}

