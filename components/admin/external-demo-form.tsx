'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ExternalDemoFormProps = {
  createAction: (formData: FormData) => Promise<{ error?: string }>;
};

export function ExternalDemoForm({ createAction }: ExternalDemoFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await createAction(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-[11px] uppercase tracking-[0.18em] text-white-40 hover:text-white-pure transition-colors py-2"
      >
        + Add external demo
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          void onSubmit(formData);
        });
      }}
      className="border border-ash p-6 flex flex-col gap-4 bg-carbon/40"
    >
      <div className="flex justify-between items-center">
        <div className="text-[10px] uppercase tracking-[0.15em] text-white-40">Add external demo</div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-xs text-white-40 hover:text-white-pure"
          disabled={pending}
        >
          Cancel
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ext-slug">Slug</Label>
        <Input
          id="ext-slug"
          name="slug"
          placeholder="mashreq-kiosk"
          autoComplete="off"
          required
          disabled={pending}
        />
        <p className="text-[10px] text-white-40">Lowercase letters, digits, hyphens.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ext-url">External URL</Label>
        <Input
          id="ext-url"
          name="external_url"
          type="url"
          placeholder="https://www.projects.almostimpossible.agency/MashreqKiosk/P2/Kiosk/"
          autoComplete="off"
          required
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="ext-title">Title (optional)</Label>
        <Input
          id="ext-title"
          name="title"
          placeholder="Short title for the gallery card"
          autoComplete="off"
          disabled={pending}
        />
        <p className="text-[10px] text-white-40">You can set this later from the edit page.</p>
      </div>

      {error && (
        <p className="text-xs text-error border border-error/30 bg-error/10 px-3 py-2">{error}</p>
      )}

      <Button type="submit" className="self-start" disabled={pending}>
        {pending ? 'Creating…' : 'Create demo'}
      </Button>
    </form>
  );
}
