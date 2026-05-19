import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'demo_portal_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function secret(): string {
  const s = process.env.AUTH_COOKIE_SECRET;
  if (!s) throw new Error('AUTH_COOKIE_SECRET not set');
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export async function verifyCredentials(user: string, pw: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME ?? 'admin';
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  if (user !== expectedUser) return false;
  return bcrypt.compare(pw, hash);
}

export async function createSession(user: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ u: user, e: exp })).toString('base64url');
  const sig = sign(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, `${payload}.${sig}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/admin',
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ user: string } | null> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME);
  if (!c) return null;
  const [payload, sig] = c.value.split('.');
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;
  let parsed: { u?: unknown; e?: unknown };
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
  if (typeof parsed.u !== 'string' || typeof parsed.e !== 'number') return null;
  if (Date.now() / 1000 > parsed.e) return null;
  return { user: parsed.u };
}

export async function requireSession(): Promise<{ user: string }> {
  const s = await getSession();
  if (!s) throw new Error('Unauthorized');
  return s;
}
