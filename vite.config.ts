import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();

  const env = loadEnv(mode, root) as unknown as ImportMetaEnv;

  return {
    plugins: [
      vue(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    base: "./",
    server: {
      open: false,
      proxy: env.VITE_PROXY_URL
        ? {
            "/api": {
              target: env.VITE_PROXY_URL,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : void 0,
    },
  };
};
