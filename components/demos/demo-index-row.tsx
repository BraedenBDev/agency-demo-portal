import { demoUrl, isExternal, type Demo } from '@/lib/demos';
import { DemoPreviewCard } from './demo-preview-card';

export function DemoIndexRow({ demo, index }: { demo: Demo; index: number }) {
  return (
    <DemoPreviewCard
      slug={demo.slug}
      title={demo.title}
      description={demo.description}
      index={index}
      href={demoUrl(demo)}
      external={isExternal(demo)}
    />
  );
}
