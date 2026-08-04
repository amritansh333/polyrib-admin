import clsx from 'clsx';

export default function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 text-sm font-semibold text-charcoal"
    >
      <span
        className={clsx(
          'relative h-6 w-11 border transition-colors duration-200',
          checked ? 'border-primary bg-primary' : 'border-border bg-surface-muted'
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-[18px] w-[18px] bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}
