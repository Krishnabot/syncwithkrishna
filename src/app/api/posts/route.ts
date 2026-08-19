import { dbUpsertPost } from '@/lib/sqlite';
import { getSortedPostsData } from '@/lib/content';
import { json, adminOnly, readJson, normalizePostInput } from '@/lib/api';

export async function GET() {
  return json(getSortedPostsData());
}

export async function POST(req: Request) {
  return adminOnly(async () => {
    const body = await readJson(req);
    const post = normalizePostInput(body);
    await dbUpsertPost(post);
    return json({ ok: true });
  });
}
