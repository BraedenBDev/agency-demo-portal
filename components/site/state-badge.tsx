type State = 'visible' | 'hidden' | 'archived';

export function StateBadge({ state }: { state: State }) {
  const classes =
    state === 'visible'
      ? 'bg-success/15 text-success'
      : state === 'archived'
        ? 'bg-white-15/20 text-white-40'
        : 'bg-warning/15 text-warning';
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] tracking-[0.05em] font-semibold uppercase ${classes}`}
    >
      {state}
    </span>
  );
}
