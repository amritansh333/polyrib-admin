import React from 'react';

export default function useDebouncedValue<T>(value: T, delay = 220) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debounced;
}
