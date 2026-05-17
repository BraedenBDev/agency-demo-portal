import { findDemoApps } from './coolify';
import { reconcileCoolifyApps } from './db';
import { writeTraefikConfig } from './traefik';

const INTERVAL_MS = Number(process.env.PORTAL_POLL_INTERVAL_MS ?? 60_000);

declare global {
  // eslint-disable-next-line no-var
  var __portalPollerStarted: boolean | undefined;
}

export function startPolling(): void {
  if (globalThis.__portalPollerStarted) return;
  globalThis.__portalPollerStarted = true;

  if (!process.env.COOLIFY_API_TOKEN) {
    console.warn('[portal-poller] COOLIFY_API_TOKEN not set; polling disabled.');
    return;
  }

  console.log(`[portal-poller] starting, interval=${INTERVAL_MS}ms`);

  void runOnce().catch((err) => {
    console.warn('[portal-poller] initial run failed:', err);
  });

  setInterval(() => {
    void runOnce().catch((err) => {
      console.warn('[portal-poller] tick failed:', err);
    });
  }, INTERVAL_MS).unref();
}

export async function runOnce(): Promise<{
  inserted: string[];
  relinked: string[];
  archived: string[];
}> {
  const apps = await findDemoApps();
  const result = reconcileCoolifyApps(
    apps.map((a) => ({ slug: a.slug, coolifyAppId: a.coolifyAppId })),
  );
  if (result.inserted.length || result.relinked.length || result.archived.length) {
    console.log(
      `[portal-poller] reconcile inserted=${result.inserted.length} relinked=${result.relinked.length} archived=${result.archived.length}`,
    );
    await writeTraefikConfig().catch((err) => {
      console.warn('[portal-poller] writeTraefikConfig failed:', err);
    });
  }
  return result;
}
