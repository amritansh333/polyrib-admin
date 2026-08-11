/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string | undefined;
    readonly VITE_DATA_SOURCE: 'mock' | 'api' | undefined;
    readonly VITE_APP_NAME: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
