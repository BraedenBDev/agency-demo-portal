import { DemoPreviewCard } from './demo-preview-card';

export type DemoIndexRowProps = {
  slug: string;
  title: string;
  description: string;
  index: number;
};

export function DemoIndexRow({ slug, title, description, index }: DemoIndexRowProps) {
  return (
    <DemoPreviewCard
      slug={slug}
      title={title}
      description={description}
      index={index}
      href={`https://${slug}.demo.almostimpossible.agency`}
    />
  );
}
