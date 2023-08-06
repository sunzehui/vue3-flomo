import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {
  ElementPlusResolve,
  createStyleImportPlugin,
} from 'vite-plugin-style-import'

export default defineConfig(({ mode }) => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  return {
    plugins: [
      vue(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),
      vueJsx({}),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    base: './',
    server: {
      open: false,
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@/assets/styles/main.scss";',
        },
      },
    },
  }
})
