import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();
  const env = loadEnv(mode, root) as unknown as ImportMetaEnv;

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      open: false,
      proxy: env.VITE_PROXY_URL
        ? {
            "/api": {
              target: env.VITE_PROXY_URL + "/api",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : void 0,
    },
  };
};
