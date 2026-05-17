import type { NextRequest } from 'next/server';
import { Readable } from 'node:stream';

import { openScreenshot } from '@/lib/screenshots';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const found = openScreenshot(filename);
  if (!found) return new Response('Not found', { status: 404 });

  return new Response(Readable.toWeb(found.stream as Readable) as ReadableStream, {
    status: 200,
    headers: {
      'content-type': found.contentType,
      'content-length': String(found.size),
      'cache-control': 'public, max-age=60',
    },
  });
}
