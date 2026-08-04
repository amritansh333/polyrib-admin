import clsx from 'clsx';

export type TabItem = {
  label: string;
  value: string;
};

export default function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-divider">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={clsx(
            '-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors',
            value === tab.value
              ? 'border-primary text-primary'
              : 'border-transparent text-charcoal-light hover:text-primary'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
