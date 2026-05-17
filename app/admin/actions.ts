'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

import {
  getDemo,
  setDemoPassword,
  setDemoScreenshot,
  updateDemoMeta,
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
