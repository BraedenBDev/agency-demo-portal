import { ArrowUpRight } from 'lucide-react';
import { OpticalArrow } from '@/components/ui/optical-arrow';

export type DemoPreviewCardProps = {
  slug: string;
  title: string;
  description: string;
  /** Index in the gallery, 1-based — rendered as a 3-digit prefix (001, 002, ...) */
  index?: number;
  /** Where clicking the row goes; omit to render non-clickable preview-only */
  href?: string;
  archived?: boolean;
  /** True for AWS-hosted / non-Coolify rows. Adds "· external" marker and swaps to ↗ */
  external?: boolean;
};

export function DemoPreviewCard({
  slug,
  title,
  description,
  index,
  href,
  archived,
  external,
}: DemoPreviewCardProps) {
  const indexLabel = index !== undefined ? String(index).padStart(3, '0') : null;
  const content = (
    <div className="flex justify-between items-start gap-6 py-5 group">
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="font-mono text-[10px] tracking-[0.08em] text-white-40">
          {indexLabel ? `${indexLabel} · ` : ''}
          {slug}
          {external ? ' · external' : ''}
          {archived ? ' · archived' : ''}
        </div>
        <h2 className="font-editorial italic text-3xl sm:text-4xl leading-[0.95] tracking-[-0.02em] text-white-pure">
          {title || 'Untitled.'}
        </h2>
        {description ? (
          <p className="text-sm text-white-70 leading-relaxed max-w-prose">{description}</p>
        ) : null}
      </div>
      {href ? (
        external ? (
          <ArrowUpRight className="w-5 h-5 text-accent shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        ) : (
          <OpticalArrow className="w-5 h-5 text-accent shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        )
      ) : null}
    </div>
  );

  if (href && !archived) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-carbon/50 -mx-3 px-3 transition-colors duration-200"
      >
        {content}
      </a>
    );
  }
  return content;
}
