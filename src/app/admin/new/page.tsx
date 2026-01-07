"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: '',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'journal',
    tags: '',
    excerpt: '',
    content: '',
    draft: false,
  });
  const update = (k: string, v: any) => setForm({ ...form, [k]: v });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) router.push('/admin');
  };
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="page-title mb-4">New Post</h1>
      <form onSubmit={submit} className="grid gap-4">
        <input className="select" placeholder="Slug" value={form.slug} onChange={(e) => update('slug', e.target.value)} required />
        <input className="select" placeholder="Title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        <input className="select" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        <select className="select" value={form.category} onChange={(e) => update('category', e.target.value)}>
          <option value="journal">Journal</option>
          <option value="essay">Essay</option>
          <option value="poem">Poem</option>
        </select>
        <input className="select" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => update('tags', e.target.value)} />
        <textarea className="select" rows={3} placeholder="Excerpt" value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        <textarea className="select" rows={10} placeholder="Content (MDX)" value={form.content} onChange={(e) => update('content', e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.draft} onChange={(e) => update('draft', e.target.checked)} /> Draft</label>
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
}

