import { listAllDemos } from '@/lib/db';
import { PageFrame } from '@/components/site/page-frame';
import { DemoAdminCard } from '@/components/demos/demo-admin-card';
import { Button } from '@/components/ui/button';
import { refreshFromCoolifyAction, togglePublishAction } from './actions';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const demos = listAllDemos();
  const visibleCount = demos.filter((d) => d.visible === 1 && d.archived === 0).length;
  const archivedCount = demos.filter((d) => d.archived === 1).length;

  return (
    <PageFrame section="Admin" rightHref="/" rightLabel="Public site">
      <header className="flex flex-col gap-3">
        <h1 className="font-editorial italic text-[clamp(40px,8vw,80px)] leading-[0.95] tracking-[-0.03em] text-white-pure">
          Roster.
        </h1>
        <p className="text-sm text-white-70">
          {demos.length} total · {visibleCount} visible · {archivedCount} archived
        </p>
        <form action={refreshFromCoolifyAction} className="self-start">
          <Button type="submit" variant="outline" size="sm">
            ↻ Refresh from Coolify
          </Button>
        </form>
      </header>

      <section className="flex flex-col gap-4">
        {demos.length === 0 ? (
          <p className="text-sm text-white-40 italic py-8">No demos tracked yet.</p>
        ) : (
          demos.map((demo) => (
            <DemoAdminCard
              key={demo.slug}
              slug={demo.slug}
              title={demo.title}
              description={demo.description}
              visible={demo.visible === 1}
              archived={demo.archived === 1}
              passwordGated={demo.password_gated === 1}
              coolifyAppId={demo.coolify_app_id}
              togglePublishAction={togglePublishAction.bind(null, demo.slug)}
            />
          ))
        )}
      </section>
    </PageFrame>
  );
}
