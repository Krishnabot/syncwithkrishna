import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body || {};
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPwd = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPwd) {
    return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
  }
  if (email === adminEmail && password === adminPwd) {
    await createAdminSession(email);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

