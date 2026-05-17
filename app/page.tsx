import { visibleDemos } from '@/lib/demos';
import { PageFrame } from '@/components/site/page-frame';
import { DemoIndexRow } from '@/components/demos/demo-index-row';
import { SectionDivider } from '@/components/site/section-divider';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const demos = visibleDemos();
  return (
    <PageFrame section="Demos">
      <header className="flex flex-col gap-3">
        <h1 className="font-editorial italic text-[clamp(56px,12vw,140px)] leading-[0.92] tracking-[-0.03em] text-white-pure">
          Demos.
        </h1>
        <p className="text-base text-white-70 max-w-prose">
          Live experiments, client-facing previews, and microsites hosted on agency infrastructure.
        </p>
      </header>

      <SectionDivider />

      <section className="flex flex-col">
        {demos.length === 0 ? (
          <p className="text-sm text-white-40 italic py-8">No demos visible yet.</p>
        ) : (
          demos.map((demo, i) => (
            <div key={demo.slug}>
              <DemoIndexRow
                slug={demo.slug}
                title={demo.title}
                description={demo.description}
                index={i + 1}
              />
              {i < demos.length - 1 && <SectionDivider />}
            </div>
          ))
        )}
      </section>

      <footer className="mt-8 flex gap-2 text-[10px] uppercase tracking-[0.15em] text-white-40">
        <span>
          {demos.length} demo{demos.length === 1 ? '' : 's'}
        </span>
        <span className="text-white-15">·</span>
        <span>v1</span>
      </footer>
    </PageFrame>
  );
}
