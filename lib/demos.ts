import { listVisibleDemos } from './db';

export type Demo = {
  slug: string;
  title: string;
  description: string;
  passwordGated?: boolean;
  screenshotPath: string | null;
};

export function visibleDemos(): Demo[] {
  return listVisibleDemos().map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    passwordGated: row.password_gated === 1,
    screenshotPath: row.screenshot_path,
  }));
}

export function demoUrl(slug: string): string {
  return `https://${slug}.demo.almostimpossible.agency`;
}
