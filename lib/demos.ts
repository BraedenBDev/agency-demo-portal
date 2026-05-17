export type Demo = {
  slug: string;
  title: string;
  description: string;
  passwordGated?: boolean;
};

// v0: hardcoded source of truth. v1 replaces this with SQLite + Coolify API polling.
export const demos: Demo[] = [
  {
    slug: 'hello-world',
    title: 'Hello, World',
    description: 'Pilot deploy validating the demo.almostimpossible.agency hosting path.',
  },
];

export function visibleDemos(): Demo[] {
  return demos;
}

export function demoUrl(slug: string): string {
  return `https://${slug}.demo.almostimpossible.agency`;
}
