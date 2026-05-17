import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export type DemoRow = {
  slug: string;
  title: string;
  description: string;
  screenshot_path: string | null;
  visible: 0 | 1;
  password_gated: 0 | 1;
  password_hash: string | null;
  basic_auth_user: string;
  archived: 0 | 1;
  coolify_app_id: string | null;
  first_seen_at: string;
  updated_at: string;
};

const DB_PATH = resolve(process.env.PORTAL_DB_PATH ?? './data/portal.db');

let _db: Database.Database | null = null;

const CREATE_DEMOS_TABLE = `
  CREATE TABLE IF NOT EXISTS demos (
    slug             TEXT PRIMARY KEY,
    title            TEXT NOT NULL DEFAULT '',
    description      TEXT NOT NULL DEFAULT '',
    screenshot_path  TEXT,
    visible          INTEGER NOT NULL DEFAULT 0,
    password_gated   INTEGER NOT NULL DEFAULT 0,
    password_hash    TEXT,
    basic_auth_user  TEXT NOT NULL DEFAULT 'client',
    archived         INTEGER NOT NULL DEFAULT 0,
    coolify_app_id   TEXT,
    first_seen_at    TEXT NOT NULL,
    updated_at       TEXT NOT NULL
  )
`;

const CREATE_VISIBLE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_demos_visible ON demos(visible) WHERE visible = 1
`;

export function db(): Database.Database {
  if (_db) return _db;

  mkdirSync(dirname(DB_PATH), { recursive: true });

  const instance = new Database(DB_PATH);
  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');

  instance.prepare(CREATE_DEMOS_TABLE).run();
  instance.prepare(CREATE_VISIBLE_INDEX).run();

  seedHelloWorld(instance);

  _db = instance;
  return instance;
}

function seedHelloWorld(instance: Database.Database): void {
  const count = (instance.prepare('SELECT COUNT(*) AS n FROM demos').get() as { n: number }).n;
  if (count > 0) return;

  const now = new Date().toISOString();
  instance.prepare(`
    INSERT INTO demos (slug, title, description, visible, first_seen_at, updated_at)
    VALUES (?, ?, ?, 1, ?, ?)
  `).run(
    'hello-world',
    'Hello, World',
    'Pilot deploy validating the demo.almostimpossible.agency hosting path.',
    now,
    now,
  );
}

export function listVisibleDemos(): DemoRow[] {
  return db().prepare(`
    SELECT * FROM demos
    WHERE visible = 1 AND archived = 0
    ORDER BY first_seen_at ASC
  `).all() as DemoRow[];
}

export function listAllDemos(): DemoRow[] {
  return db().prepare(`
    SELECT * FROM demos
    ORDER BY archived ASC, visible DESC, first_seen_at ASC
  `).all() as DemoRow[];
}

export function getDemo(slug: string): DemoRow | null {
  return (db().prepare('SELECT * FROM demos WHERE slug = ?').get(slug) as DemoRow | undefined) ?? null;
}

export type CoolifyAppSnapshot = { slug: string; coolifyAppId: string };

export function reconcileCoolifyApps(snapshot: CoolifyAppSnapshot[]): {
  inserted: string[];
  relinked: string[];
  archived: string[];
} {
  const now = new Date().toISOString();
  const liveSlugs = new Set(snapshot.map((s) => s.slug));
  const inserted: string[] = [];
  const relinked: string[] = [];
  const archived: string[] = [];

  const upsert = db().prepare(`
    INSERT INTO demos (slug, coolify_app_id, first_seen_at, updated_at)
    VALUES (@slug, @coolifyAppId, @now, @now)
    ON CONFLICT(slug) DO UPDATE SET
      coolify_app_id = excluded.coolify_app_id,
      archived = 0,
      updated_at = excluded.updated_at
    RETURNING (CASE WHEN first_seen_at = @now THEN 'inserted' ELSE 'relinked' END) AS action
  `);

  const archiveStmt = db().prepare(`
    UPDATE demos
    SET archived = 1, updated_at = ?
    WHERE coolify_app_id IS NOT NULL AND coolify_app_id != ''
      AND archived = 0
      AND slug NOT IN (SELECT value FROM json_each(?))
    RETURNING slug
  `);

  const txn = db().transaction((items: CoolifyAppSnapshot[]) => {
    for (const item of items) {
      const result = upsert.get({ slug: item.slug, coolifyAppId: item.coolifyAppId, now }) as {
        action: 'inserted' | 'relinked';
      };
      (result.action === 'inserted' ? inserted : relinked).push(item.slug);
    }
    const archivedRows = archiveStmt.all(now, JSON.stringify([...liveSlugs])) as { slug: string }[];
    for (const row of archivedRows) archived.push(row.slug);
  });

  txn(snapshot);
  return { inserted, relinked, archived };
}

export type DemoMetaPatch = {
  title?: string;
  description?: string;
  visible?: boolean;
};

export function updateDemoMeta(slug: string, patch: DemoMetaPatch): void {
  const now = new Date().toISOString();
  db().prepare(`
    UPDATE demos SET
      title       = COALESCE(@title, title),
      description = COALESCE(@description, description),
      visible     = COALESCE(@visible, visible),
      updated_at  = @now
    WHERE slug = @slug
  `).run({
    slug,
    title: patch.title ?? null,
    description: patch.description ?? null,
    visible: patch.visible === undefined ? null : patch.visible ? 1 : 0,
    now,
  });
}

export function setDemoPassword(slug: string, passwordHash: string | null): void {
  const now = new Date().toISOString();
  db().prepare(`
    UPDATE demos SET
      password_gated = ?,
      password_hash  = ?,
      updated_at     = ?
    WHERE slug = ?
  `).run(passwordHash ? 1 : 0, passwordHash, now, slug);
}

export function setDemoScreenshot(slug: string, screenshotPath: string): void {
  const now = new Date().toISOString();
  db().prepare(`
    UPDATE demos SET screenshot_path = ?, updated_at = ? WHERE slug = ?
  `).run(screenshotPath, now, slug);
}
