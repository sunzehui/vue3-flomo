export {};
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface ImportMetaEnv {
    VITE_APP_TITLE: string;
    VITE_PORT: number;
    VITE_API_URL: string;
  }
}
