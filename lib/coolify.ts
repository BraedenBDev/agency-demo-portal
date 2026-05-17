const COOLIFY_BASE_URL =
  process.env.COOLIFY_API_URL?.replace(/\/$/, '') ?? 'http://coolify.atlas.local:8000';
const COOLIFY_API_TOKEN = process.env.COOLIFY_API_TOKEN ?? '';

const DEMO_SUFFIX = '.demo.almostimpossible.agency';

export type DemoApp = {
  coolifyAppId: string;
  slug: string;
  fqdn: string;
};

type CoolifyAppRecord = {
  uuid?: string;
  name?: string;
  fqdn?: string | null;
  domains?: string | null;
  [key: string]: unknown;
};

export class CoolifyClientError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'CoolifyClientError';
  }
}

export async function listCoolifyApps(
  fetchImpl: typeof fetch = fetch,
): Promise<CoolifyAppRecord[]> {
  if (!COOLIFY_API_TOKEN) {
    throw new CoolifyClientError('COOLIFY_API_TOKEN is not set');
  }

  const res = await fetchImpl(`${COOLIFY_BASE_URL}/api/v1/applications`, {
    headers: { Authorization: `Bearer ${COOLIFY_API_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new CoolifyClientError(
      `Coolify API ${res.status}: ${await res.text().catch(() => '')}`,
      res.status,
    );
  }

  const body = (await res.json()) as unknown;
  if (!Array.isArray(body)) {
    throw new CoolifyClientError('Coolify /applications did not return an array');
  }
  return body as CoolifyAppRecord[];
}

export function extractDemoSlug(app: CoolifyAppRecord): string | null {
  const candidates: string[] = [];
  if (typeof app.fqdn === 'string') candidates.push(app.fqdn);
  if (typeof app.domains === 'string') candidates.push(app.domains);

  for (const raw of candidates) {
    for (const piece of raw.split(',').map((s) => s.trim()).filter(Boolean)) {
      const host = parseHost(piece);
      if (!host) continue;
      if (!host.endsWith(DEMO_SUFFIX)) continue;
      const slug = host.slice(0, -DEMO_SUFFIX.length);
      if (slug && !slug.includes('.')) return slug;
    }
  }
  return null;
}

function parseHost(value: string): string | null {
  try {
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(withScheme).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export async function findDemoApps(
  fetchImpl: typeof fetch = fetch,
): Promise<DemoApp[]> {
  const apps = await listCoolifyApps(fetchImpl);
  const out: DemoApp[] = [];
  const seen = new Set<string>();

  for (const app of apps) {
    const slug = extractDemoSlug(app);
    if (!slug) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);

    out.push({
      coolifyAppId: app.uuid ?? '',
      slug,
      fqdn: `${slug}${DEMO_SUFFIX}`,
    });
  }

  return out;
}
