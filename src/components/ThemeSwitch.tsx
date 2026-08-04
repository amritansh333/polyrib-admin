import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitch() {
  const [dark, setDark] = React.useState<boolean>(() =>
    document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((s) => !s)}
      className="flex h-10 w-10 items-center justify-center border border-border bg-surface text-charcoal-light transition-all duration-200 hover:border-primary hover:text-primary"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
