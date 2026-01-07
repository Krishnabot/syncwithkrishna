import initSqlJs from 'sql.js';
import type { Post } from '@/lib/content';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'blog.sqlite');

type SqlJsStmt = {
  bind: (params?: unknown[]) => void;
  step: () => boolean;
  getAsObject: (params?: unknown[]) => Record<string, unknown>;
  run: (params?: unknown[]) => void;
  free: () => void;
};
type SqlJsDb = {
  exec: (sql: string) => Array<{ columns: string[]; values: unknown[][] }>;
  prepare: (sql: string) => SqlJsStmt;
  export: () => Uint8Array;
};
type SqlJsModule = { Database: new (buffer?: Uint8Array) => SqlJsDb };

let SQLPromise: Promise<SqlJsModule> | null = null;

async function getSQL(): Promise<SqlJsModule> {
  if (!SQLPromise) {
    SQLPromise = initSqlJs({
      locateFile: (file: string) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
    }) as unknown as Promise<SqlJsModule>;
  }
  return SQLPromise;
}

export async function openDb(): Promise<{ SQL: SqlJsModule; db: SqlJsDb }> {
  const SQL = await getSQL();
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  let db: SqlJsDb;
  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      title TEXT,
      date TEXT,
      category TEXT,
      tags TEXT,
      excerpt TEXT,
      content TEXT,
      draft INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      email TEXT,
      created_at TEXT
    );
  `);
  return { SQL, db };
}

export function saveDb(SQL: SqlJsModule, db: { export: () => Uint8Array }) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export async function dbGetPosts(): Promise<Post[]> {
  const { db } = await openDb();
  const res = db.exec('SELECT slug, title, date, category, tags, excerpt, content, draft FROM posts ORDER BY date DESC');
  const rows = (res[0]?.values || []) as unknown[][];
  return rows.map((r) => {
    const [slug, title, date, category, tags, excerpt, content, draft] = r;
    return {
      slug: String(slug),
      title: String(title),
      date: String(date),
      category: String(category) as Post['category'],
      tags: (typeof tags === 'string' ? JSON.parse(tags as string) : []) as string[],
      excerpt: String(excerpt ?? ''),
      content: String(content ?? ''),
      draft: !!draft,
    } as Post;
  });
}

export async function dbGetPost(category: string, slug: string): Promise<Post | null> {
  const { db } = await openDb();
  const stmt = db.prepare('SELECT slug, title, date, category, tags, excerpt, content, draft FROM posts WHERE category = ? AND slug = ?');
  const row = stmt.getAsObject([category, slug]);
  stmt.free();
  if (!row || !row.slug) return null;
  return {
    slug: row.slug as string,
    title: row.title as string,
    date: row.date as string,
    category: String(row.category) as Post['category'],
    tags: row.tags ? (JSON.parse(row.tags as string) as string[]) : [],
    excerpt: (row.excerpt as string) ?? '',
    content: (row.content as string) ?? '',
    draft: !!row.draft,
  } as Post;
}

export async function dbGetPostBySlug(slug: string): Promise<Post | null> {
  const { db } = await openDb();
  const stmt = db.prepare('SELECT slug, title, date, category, tags, excerpt, content, draft FROM posts WHERE slug = ? LIMIT 1');
  const row = stmt.getAsObject([slug]);
  stmt.free();
  if (!row || !row.slug) return null;
  return {
    slug: String(row.slug),
    title: String(row.title),
    date: String(row.date),
    category: String(row.category) as Post['category'],
    tags: row.tags ? (JSON.parse(row.tags as string) as string[]) : [],
    excerpt: (row.excerpt as string) ?? '',
    content: (row.content as string) ?? '',
    draft: !!row.draft,
  } as Post;
}

export async function dbUpsertPost(post: { slug: string; title: string; date: string; category: string; tags: string[]; excerpt: string; content: string; draft?: boolean }) {
  const { SQL, db } = await openDb();
  const stmt = db.prepare('INSERT INTO posts (slug, title, date, category, tags, excerpt, content, draft) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title, date=excluded.date, category=excluded.category, tags=excluded.tags, excerpt=excluded.excerpt, content=excluded.content, draft=excluded.draft');
  stmt.run([post.slug, post.title, post.date, post.category, JSON.stringify(post.tags || []), post.excerpt, post.content, post.draft ? 1 : 0]);
  stmt.free();
  saveDb(SQL, db);
}

export async function dbDeletePost(slug: string) {
  const { SQL, db } = await openDb();
  const stmt = db.prepare('DELETE FROM posts WHERE slug = ?');
  stmt.run([slug]);
  stmt.free();
  saveDb(SQL, db);
}

export async function dbGetPostsByCategory(category: string): Promise<Post[]> {
  const { db } = await openDb();
  const stmt = db.prepare('SELECT slug, title, date, category, tags, excerpt, content, draft FROM posts WHERE category = ? ORDER BY date DESC');
  const rows: Record<string, unknown>[] = [];
  stmt.bind([category]);
  while (stmt.step()) {
    const row = stmt.getAsObject();
    rows.push(row);
  }
  stmt.free();
  return rows.map((row) => ({
    slug: String(row.slug),
    title: String(row.title),
    date: String(row.date),
    category: String(row.category) as Post['category'],
    tags: typeof row.tags === 'string' ? (JSON.parse(row.tags as string) as string[]) : [],
    excerpt: String(row.excerpt ?? ''),
    content: String(row.content ?? ''),
    draft: !!row.draft,
  } as Post));
}

export async function dbGetAllSlugs() {
  const { db } = await openDb();
  const stmt = db.prepare('SELECT category, slug FROM posts');
  const out: { category: string; slug: string }[] = [];
  while (stmt.step()) {
    const r = stmt.getAsObject();
    out.push({ category: r.category as string, slug: r.slug as string });
  }
  stmt.free();
  return out;
}

export async function dbGetPostsByTag(tag: string): Promise<Post[]> {
  const { db } = await openDb();
  const result = db.exec('SELECT slug, title, date, category, tags, excerpt, content, draft FROM posts ORDER BY date DESC');
  const rows = (result[0]?.values || []) as unknown[][];
  const t = tag.toLowerCase();
  return rows
    .map((r) => {
      const [slug, title, date, category, tags, excerpt, content, draft] = r;
      return {
        slug: String(slug),
        title: String(title),
        date: String(date),
        category: String(category) as Post['category'],
        tags: typeof tags === 'string' ? (JSON.parse(tags as string) as string[]) : [],
        excerpt: String(excerpt ?? ''),
        content: String(content ?? ''),
        draft: !!draft,
      } as Post;
    })
    .filter((p) => (p.tags || []).some((x: string) => x.toLowerCase() === t));
}

export async function dbGetAllTags() {
  const posts = await dbGetPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.tags || []) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function dbHasPosts() {
  const posts = await dbGetPosts();
  return posts.length > 0;
}

export async function dbCreateSession(token: string, email: string) {
  const { SQL, db } = await openDb();
  const stmt = db.prepare('INSERT INTO sessions (token, email, created_at) VALUES (?, ?, ?)');
  stmt.run([token, email, new Date().toISOString()]);
  stmt.free();
  saveDb(SQL, db);
}

export async function dbDeleteSession(token: string) {
  const { SQL, db } = await openDb();
  const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
  stmt.run([token]);
  stmt.free();
  saveDb(SQL, db);
}

export async function dbGetSession(token: string) {
  const { db } = await openDb();
  const stmt = db.prepare('SELECT token, email, created_at FROM sessions WHERE token = ?');
  const row = stmt.getAsObject([token]);
  stmt.free();
  return row && (row.token as string) ? { token: row.token as string, email: row.email as string } : null;
}
