import { dbGetPosts, dbUpsertPost } from '@/lib/sqlite';
import { json, adminOnly, readJson, normalizePostInput } from '@/lib/api';

export async function GET() {
  const posts = await dbGetPosts();
  return json(posts);
}

export async function POST(req: Request) {
  return adminOnly(async () => {
    const body = await readJson(req);
    const post = normalizePostInput(body);
    await dbUpsertPost(post);
    return json({ ok: true });
  });
}
