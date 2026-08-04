import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60">
      <div className="animate-pulse p-4 rounded bg-slate-100 dark:bg-slate-800">Loading…</div>
    </div>
  );
}
