import { ArrowUpRight, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ArrowUpRight with a 1px upward optical offset. The icon points toward the
 * upper-right corner, so its visual centre sits above its bounding-box centre.
 * When baselined with text the raw icon drifts up-right; `-translate-y-px`
 * compensates so the arrow tip lands on the mid-cap line.
 */
export function OpticalArrow(props: LucideProps) {
  return <ArrowUpRight {...props} className={cn('-translate-y-px', props.className)} />;
}
