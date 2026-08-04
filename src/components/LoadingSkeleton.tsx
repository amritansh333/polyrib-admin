import clsx from 'clsx';

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-shimmer bg-[linear-gradient(90deg,hsl(var(--surface-subtle))_0%,hsl(var(--surface-muted))_50%,hsl(var(--surface-subtle))_100%)] bg-[length:700px_100%]',
        className
      )}
    />
  );
}
