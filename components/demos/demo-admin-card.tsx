import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StateBadge } from '@/components/site/state-badge';

export type DemoAdminCardProps = {
  slug: string;
  title: string;
  description: string;
  visible: boolean;
  archived: boolean;
  passwordGated: boolean;
  coolifyAppId: string | null;
  externalUrl: string | null;
  togglePublishAction: () => Promise<void>;
};

export function DemoAdminCard({
  slug,
  title,
  description,
  visible,
  archived,
  passwordGated,
  coolifyAppId,
  externalUrl,
  togglePublishAction,
}: DemoAdminCardProps) {
  const state = archived ? 'archived' : visible ? 'visible' : 'hidden';
  const external = externalUrl !== null;
  return (
    <article className="border border-ash p-6 flex flex-col gap-3 bg-carbon/40">
      <header className="flex justify-between items-start gap-3">
        <div className="font-mono text-[10px] tracking-[0.05em] text-white-40">
          {slug}
          {external ? (
            <span className="text-white-15"> · external</span>
          ) : coolifyAppId ? (
            <span className="text-white-15"> · {coolifyAppId.slice(0, 8)}</span>
          ) : null}
        </div>
        <StateBadge state={state} />
      </header>
      <h2 className="font-editorial italic text-2xl leading-[1] tracking-[-0.02em] text-white-pure">
        {title || <span className="text-white-40">Untitled.</span>}
      </h2>
      {description ? (
        <p className="text-sm text-white-70 leading-relaxed">{description}</p>
      ) : (
        <p className="text-sm text-white-15 italic">No description yet.</p>
      )}
      {external && externalUrl && (
        <p className="text-xs text-white-40 font-mono truncate" title={externalUrl}>
          ↗ {externalUrl}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-2 items-center">
        {!archived && (
          <form action={togglePublishAction}>
            <Button type="submit" variant={visible ? 'secondary' : 'default'} size="sm">
              {visible ? 'Unpublish' : 'Publish'}
            </Button>
          </form>
        )}
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/${slug}`}>Edit</Link>
        </Button>
        {!external && passwordGated && (
          <span className="text-[10px] uppercase tracking-[0.1em] text-white-40 ml-auto">
            🔒 password-gated
          </span>
        )}
      </div>
    </article>
  );
}
