import { notFound } from 'next/navigation';
import { getDemo } from '@/lib/db';
import { PageFrame } from '@/components/site/page-frame';
import { PreviewEditor } from '@/components/admin/preview-editor';
import {
  setPasswordAction,
  updateExternalUrlAction,
  updateMetaAction,
  uploadScreenshotAction,
} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();

  const external = demo.external_url !== null;

  const boundUpdateMeta = updateMetaAction.bind(null, slug);
  const boundUploadScreenshot = uploadScreenshotAction.bind(null, slug);
  const boundSetPassword = setPasswordAction.bind(null, slug);
  const boundUpdateExternalUrl = updateExternalUrlAction.bind(null, slug);

  const liveHref = external
    ? demo.external_url!
    : `https://${demo.slug}.demo.almostimpossible.agency`;
  const liveHrefLabel = external
    ? demo.external_url!
    : `${demo.slug}.demo.almostimpossible.agency`;

  return (
    <PageFrame section="Edit demo" rightHref="/admin" rightLabel="Roster">
      <header className="flex flex-col gap-2">
        <div className="font-mono text-[11px] tracking-[0.05em] text-white-40">
          {demo.slug}
          {external ? ' · external' : ''}
          {demo.archived === 1 ? ' · archived (Coolify app removed)' : ''}
        </div>
        <h1 className="font-editorial italic text-[clamp(36px,7vw,72px)] leading-[0.95] tracking-[-0.02em] text-white-pure">
          {demo.title || 'Untitled.'}
        </h1>
        {demo.archived !== 1 && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline self-start truncate"
          >
            {liveHrefLabel} ↗
          </a>
        )}
      </header>

      <PreviewEditor
        slug={slug}
        initial={{
          title: demo.title,
          description: demo.description,
          visible: demo.visible === 1,
          screenshotPath: demo.screenshot_path,
          archived: demo.archived === 1,
          passwordGated: demo.password_gated === 1,
          external,
          externalUrl: demo.external_url,
        }}
        updateMetaAction={boundUpdateMeta}
        uploadScreenshotAction={boundUploadScreenshot}
        setPasswordAction={boundSetPassword}
        updateExternalUrlAction={boundUpdateExternalUrl}
      />
    </PageFrame>
  );
}
