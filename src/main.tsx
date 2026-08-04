import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes/AppRouter';
import './styles/index.css';
import { AuthProvider } from './auth/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import { RepositoryProvider } from './repositories/RepositoryProvider';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <RepositoryProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </RepositoryProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
