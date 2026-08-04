import React, { createContext, useContext, useState } from 'react';

type Toast = { id: string; message: string };
const ToastContext = createContext({ push: (m: string) => {} } as { push: (m: string) => void });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (message: string) => setToasts((s) => [...s, { id: String(Date.now()), message }]);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="px-4 py-2 bg-white dark:bg-slate-800 rounded shadow">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
