'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import {
  createExternalDemo,
  getDemo,
  setDemoPassword,
  setDemoScreenshot,
  updateDemoMeta,
  updateExternalUrl,
} from '@/lib/db';
import { runOnce } from '@/lib/polling';
import { saveScreenshot } from '@/lib/screenshots';
import { writeTraefikConfig } from '@/lib/traefik';

function refresh(slug: string) {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(`/admin/${slug}`);
}

export async function updateMetaAction(slug: string, formData: FormData): Promise<void> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const visible = formData.get('visible') === 'on';

  updateDemoMeta(slug, { title, description, visible });
  refresh(slug);
}

export async function uploadScreenshotAction(slug: string, formData: FormData): Promise<void> {
  const file = formData.get('screenshot');
  if (!(file instanceof File) || file.size === 0) return;

  const relativePath = await saveScreenshot(slug, file);
  setDemoScreenshot(slug, relativePath);
  refresh(slug);
}

export async function setPasswordAction(slug: string, formData: FormData): Promise<void> {
  const password = String(formData.get('password') ?? '');
  if (!password) {
    setDemoPassword(slug, null);
  } else {
    const hash = await bcrypt.hash(password, 10);
    setDemoPassword(slug, hash);
  }
  await writeTraefikConfig().catch((err) => {
    console.warn('[admin] writeTraefikConfig failed:', err);
  });
  refresh(slug);
}

export async function togglePublishAction(slug: string): Promise<void> {
  const demo = getDemo(slug);
  if (!demo || demo.archived === 1) return;
  updateDemoMeta(slug, { visible: demo.visible !== 1 });
  refresh(slug);
}

export async function refreshFromCoolifyAction(): Promise<void> {
  try {
    await runOnce();
  } catch (err) {
    console.warn('[admin] manual refresh failed:', err);
  }
  revalidatePath('/');
  revalidatePath('/admin');
}

// ----- External / legacy demos -----

const SLUG_RE = /^[a-z0-9-]+$/;
const MAX_SLUG_LEN = 64;
const MAX_URL_LEN = 2048;

function validateSlug(slug: string): string | null {
  if (!slug) return 'Slug is required.';
  if (slug.length > MAX_SLUG_LEN) return `Slug must be ≤ ${MAX_SLUG_LEN} characters.`;
  if (!SLUG_RE.test(slug)) return 'Slug must contain only lowercase letters, digits, and hyphens.';
  return null;
}

function validateExternalUrl(url: string): string | null {
  if (!url) return 'URL is required.';
  if (url.length > MAX_URL_LEN) return `URL must be ≤ ${MAX_URL_LEN} characters.`;
  if (/\s/.test(url)) return 'URL must not contain whitespace.';
  if (!url.startsWith('https://')) return 'URL must start with https://';
  return null;
}

export async function createExternalDemoAction(formData: FormData): Promise<{ error?: string }> {
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  const externalUrl = String(formData.get('external_url') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();

  const slugError = validateSlug(slug);
  if (slugError) return { error: slugError };
  const urlError = validateExternalUrl(externalUrl);
  if (urlError) return { error: urlError };

  try {
    createExternalDemo({ slug, externalUrl, title: title || undefined });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed: demos\.slug/i.test(msg)) {
      return { error: 'A demo with that slug already exists.' };
    }
    console.error('[admin] createExternalDemoAction failed:', err);
    return { error: 'Could not create demo. See server logs.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return {};
}

export async function updateExternalUrlAction(
  slug: string,
  formData: FormData,
): Promise<{ error?: string }> {
  const externalUrl = String(formData.get('external_url') ?? '').trim();
  const urlError = validateExternalUrl(externalUrl);
  if (urlError) return { error: urlError };

  updateExternalUrl(slug, externalUrl);
  refresh(slug);
  return {};
}
