import React from 'react';
import { ENV } from '../lib/config';
import { apiRepository } from './apiRepository';
import { mockRepository } from '../services/mockRepository';
import type { ResourceRepository } from './types';

const RepositoryContext = React.createContext<ResourceRepository | undefined>(undefined);

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const repository = ENV.DATA_SOURCE === 'api' ? apiRepository : mockRepository;

  return <RepositoryContext.Provider value={repository}>{children}</RepositoryContext.Provider>;
}

export function useRepository() {
  const repository = React.useContext(RepositoryContext);
  if (!repository) throw new Error('useRepository must be used within RepositoryProvider');
  return repository;
}
