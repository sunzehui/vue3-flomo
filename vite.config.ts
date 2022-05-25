import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { UserConfigExport, ConfigEnv, loadEnv } from "vite";
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();

  const env = loadEnv(mode, root) as unknown as ImportMetaEnv;
  setTimeout(() => {
    console.log(env, mode);
  }, 2000);
  return {
    plugins: [vue()],
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
