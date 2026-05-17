import { mkdirSync, createReadStream, statSync, existsSync } from 'node:fs';
import { writeFile, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const SCREENSHOTS_DIR = resolve(
  process.env.PORTAL_SCREENSHOTS_DIR ?? './data/screenshots',
);
const MAX_BYTES = 5 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export class ScreenshotError extends Error {}

export async function saveScreenshot(slug: string, file: File): Promise<string> {
  if (!SLUG_PATTERN.test(slug)) {
    throw new ScreenshotError(`Invalid slug: ${slug}`);
  }
  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    throw new ScreenshotError(`Unsupported image type: ${file.type}`);
  }
  if (file.size > MAX_BYTES) {
    throw new ScreenshotError(`File too large (max ${MAX_BYTES} bytes)`);
  }

  mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  for (const oldExt of Object.values(EXT_BY_MIME)) {
    if (oldExt === ext) continue;
    const oldPath = join(SCREENSHOTS_DIR, `${slug}.${oldExt}`);
    if (existsSync(oldPath)) {
      await unlink(oldPath).catch(() => {});
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${slug}.${ext}`;
  await writeFile(join(SCREENSHOTS_DIR, filename), buffer);
  return `screenshots/${filename}`;
}

export function openScreenshot(filename: string):
  | { stream: NodeJS.ReadableStream; size: number; contentType: string }
  | null {
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.(png|jpg|jpeg|webp)$/i.test(filename)) {
    return null;
  }
  const fullPath = join(SCREENSHOTS_DIR, filename);
  if (!existsSync(fullPath)) return null;
  const stat = statSync(fullPath);
  const ext = filename.split('.').pop()!.toLowerCase();
  const contentType =
    ext === 'png' ? 'image/png' :
    ext === 'webp' ? 'image/webp' :
    'image/jpeg';
  return { stream: createReadStream(fullPath), size: stat.size, contentType };
}
