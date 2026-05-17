'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DemoPreviewCard } from '@/components/demos/demo-preview-card';

export type PreviewEditorProps = {
  slug: string;
  initial: {
    title: string;
    description: string;
    visible: boolean;
    screenshotPath: string | null;
    archived: boolean;
    passwordGated: boolean;
  };
  updateMetaAction: (formData: FormData) => Promise<void>;
  uploadScreenshotAction: (formData: FormData) => Promise<void>;
  setPasswordAction: (formData: FormData) => Promise<void>;
};

export function PreviewEditor({
  slug,
  initial,
  updateMetaAction,
  uploadScreenshotAction,
  setPasswordAction,
}: PreviewEditorProps) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [visible, setVisible] = useState(initial.visible);
  const [pendingScreenshotUrl, setPendingScreenshotUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingScreenshotUrl) URL.revokeObjectURL(pendingScreenshotUrl);
    };
  }, [pendingScreenshotUrl]);

  function onScreenshotPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (pendingScreenshotUrl) URL.revokeObjectURL(pendingScreenshotUrl);
    setPendingScreenshotUrl(URL.createObjectURL(file));
  }

  const screenshotSrc = pendingScreenshotUrl ?? (initial.screenshotPath ? `/${initial.screenshotPath}` : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
      {/* Form column */}
      <div className="flex flex-col gap-8">
        <form action={updateMetaAction} className="flex flex-col gap-5">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white-40">Metadata</div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short title for the demo card"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="One line that explains the demo to a client."
            />
          </div>

          <label className="flex items-center gap-3 text-sm">
            <Checkbox
              name="visible"
              checked={visible}
              onCheckedChange={(v) => setVisible(v === true)}
            />
            <span>Visible on public landing</span>
          </label>

          <Button type="submit" className="self-start">
            Save metadata
          </Button>
        </form>

        <form action={uploadScreenshotAction} className="flex flex-col gap-3 border-t border-ash pt-6">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white-40">Screenshot</div>
          {screenshotSrc && (
            <img
              src={screenshotSrc}
              alt={`${slug} screenshot preview`}
              className="max-w-xs rounded border border-ash"
            />
          )}
          <Input
            type="file"
            name="screenshot"
            accept="image/png,image/jpeg,image/webp"
            onChange={onScreenshotPick}
            className="text-sm"
          />
          <Button type="submit" variant="outline" className="self-start">
            Upload
          </Button>
        </form>

        <form action={setPasswordAction} className="flex flex-col gap-3 border-t border-ash pt-6">
          <div className="text-[10px] uppercase tracking-[0.15em] text-white-40">Password gate</div>
          <p className="text-xs text-white-70">
            {initial.passwordGated
              ? '🔒 Currently gated. New password rotates; empty clears.'
              : 'Currently open. Set a password to enable basic-auth.'}
          </p>
          <Input
            type="password"
            name="password"
            placeholder={initial.passwordGated ? 'Rotate, or leave blank to clear' : 'New password'}
          />
          <Button type="submit" variant="outline" className="self-start">
            {initial.passwordGated ? 'Update password' : 'Set password'}
          </Button>
        </form>
      </div>

      {/* Preview column */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-20 self-start w-full">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white-40">Live preview</div>
        <div className="border border-ash p-6 bg-carbon/30">
          <DemoPreviewCard
            slug={slug}
            title={title}
            description={description}
            archived={initial.archived}
          />
        </div>
        <p className="text-[10px] text-white-40">
          {`This is the exact component the public landing renders. Visibility doesn't gate the preview — it only affects whether the row appears on / once saved.`}
        </p>
      </div>
    </div>
  );
}
