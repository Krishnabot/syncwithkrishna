"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/content';

type Category = Post['category'];
type FormState = {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags: string;
  excerpt: string;
  content: string;
  draft: boolean;
};

export default function PostEditor({ post }: { post: Post }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    tags: (post.tags || []).join(', '),
    excerpt: post.excerpt || '',
    content: post.content || '',
    draft: !!post.draft,
  });
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm({ ...form, [k]: v });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    };
    const res = await fetch(`/api/posts/${form.slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) router.push('/admin');
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-title mb-4">Edit Post</h1>
      <form onSubmit={submit} className="grid gap-4">
        <input className="select" placeholder="Slug" value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
        <input className="select" placeholder="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        <input className="select" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        <select className="select" value={form.category} onChange={(e) => update('category', e.target.value as Category)}>
          <option value="journal">Journal</option>
          <option value="essay">Essay</option>
          <option value="poem">Poem</option>
        </select>
        <input className="select" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
        <textarea className="select" rows={3} placeholder="Excerpt" value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        <textarea className="select" rows={10} placeholder="Content (MDX)" value={form.content} onChange={(e) => update('content', e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.draft} onChange={(e) => update('draft', e.target.checked)} /> Draft</label>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}

