import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'

import {
  ElementPlusResolve,
  createStyleImportPlugin,
} from 'vite-plugin-style-import'

export default ({ mode }) => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  return {
    plugins: [
      vue(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),
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
  }
}
