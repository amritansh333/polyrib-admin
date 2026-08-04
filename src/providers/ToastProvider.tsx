import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

type ToastTone = 'success' | 'error' | 'info';
type Toast = { id: string; message: string; tone: ToastTone };
const ToastContext = createContext({ push: (_m: string, _tone?: ToastTone) => {} } as {
  push: (message: string, tone?: ToastTone) => void;
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (message: string, tone: ToastTone = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'border px-4 py-2 text-sm font-semibold shadow-card',
              t.tone === 'success' &&
                'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
              t.tone === 'error' &&
                'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
              t.tone === 'info' && 'border-border bg-surface-raised text-charcoal'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
