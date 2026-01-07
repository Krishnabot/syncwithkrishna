import crypto from 'crypto';
import { cookies } from 'next/headers';
import { dbCreateSession, dbGetSession, dbDeleteSession } from './sqlite';

export async function createAdminSession(email: string) {
  const token = crypto.randomBytes(24).toString('hex');
  await dbCreateSession(token, email);
  const c = await cookies();
  c.set('session', token, { httpOnly: true, path: '/', sameSite: 'lax' });
}

export async function destroyAdminSession() {
  const c = await cookies();
  const token = c.get('session')?.value;
  if (token) {
    await dbDeleteSession(token);
    c.delete('session');
  }
}

export async function requireAdmin(): Promise<string | null> {
  const c = await cookies();
  const token = c.get('session')?.value;
  if (!token) return null;
  const session = await dbGetSession(token);
  return session?.email || null;
}

