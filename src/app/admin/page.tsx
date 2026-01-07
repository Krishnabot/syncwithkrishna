import { requireAdmin } from '@/lib/auth';
import { dbGetPosts } from '@/lib/sqlite';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DeleteButton from '@/components/admin/DeleteButton';
import SeedButton from '@/components/admin/SeedButton';
import type { Post } from '@/lib/content';

export default async function AdminPage() {
  const email = await requireAdmin();
  if (!email) redirect('/admin/login');
  const rows = await dbGetPosts();
  const posts: Post[] = rows.map((p) => ({ ...p, category: p.category as Post['category'], tags: p.tags as string[] }));
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">Admin</h1>
        <form action="/api/admin/logout" method="post">
          <button className="btn" type="submit">Log out</button>
        </form>
      </div>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/admin/new" className="btn btn-primary">New Post</Link>
        <SeedButton />
      </div>
      <div className="grid gap-4">
        {posts.map((p: Post) => (
          <div key={p.slug} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm muted">{p.category} • {new Date(p.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/edit/${p.slug}`} className="btn">Edit</Link>
              <DeleteButton slug={p.slug} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
