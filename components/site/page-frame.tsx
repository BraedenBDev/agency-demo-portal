import Link from 'next/link';
import { OpticalArrow } from '@/components/ui/optical-arrow';

export type PageFrameProps = {
  section: string;
  rightHref?: string;
  rightLabel?: string;
  children: React.ReactNode;
};

export function PageFrame({ section, rightHref, rightLabel, children }: PageFrameProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-8 pt-20 pb-32 flex flex-col gap-12">
      <div className="flex justify-between items-center text-[11px] tracking-[0.18em] uppercase text-white-40">
        <span>Almost Impossible · {section}</span>
        {rightHref && rightLabel ? (
          <Link
            href={rightHref}
            className="flex items-center gap-1 hover:text-white-pure transition-colors duration-200"
          >
            {rightLabel}
            <OpticalArrow className="w-3 h-3" />
          </Link>
        ) : null}
      </div>
      {children}
    </main>
  );
}
