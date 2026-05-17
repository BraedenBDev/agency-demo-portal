import { listVisibleDemos } from './db';

export type Demo = {
  slug: string;
  title: string;
  description: string;
  passwordGated?: boolean;
  screenshotPath: string | null;
  externalUrl: string | null;
};

export function visibleDemos(): Demo[] {
  return listVisibleDemos().map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    passwordGated: row.password_gated === 1,
    screenshotPath: row.screenshot_path,
    externalUrl: row.external_url,
  }));
}

export function demoUrl(demo: Pick<Demo, 'slug' | 'externalUrl'>): string {
  return demo.externalUrl ?? `https://${demo.slug}.demo.almostimpossible.agency`;
}

export function isExternal(demo: Pick<Demo, 'externalUrl'>): boolean {
  return demo.externalUrl !== null;
}
