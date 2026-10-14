export {};
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  interface ImportMetaEnv {
    VITE_APP_TITLE: string;
    VITE_PORT: number;
    /** 接口前缀，留空表示同源（由 vite 代理或 nginx 转发 /api） */
    VITE_API_URL: string;
    /** 仅开发环境：vite dev server 的 /api 代理目标 */
    VITE_PROXY_TARGET: string;
  }
}
