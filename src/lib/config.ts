import type { RepositoryDataSource } from '../repositories/types';

const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock';

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  DATA_SOURCE: dataSource satisfies RepositoryDataSource,
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Polyrib Admin',
};
