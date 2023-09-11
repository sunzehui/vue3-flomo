import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig, loadEnv } from 'vite'
import VueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import ElementPlus from 'unplugin-element-plus/vite'
import { chunkFileNames, entryFileNames, processAssetFileNames } from './vite/build-assetdir'

export default defineConfig(({ mode }) => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  return {
    plugins: [
      VueMacros({
        plugins: {
          vue: Vue(),
          vueJsx: VueJsx(), // if needed
        },
        defineRender: true,
        defineModels: true,
      }),
      ElementPlus({}),
      legacy({
        targets: ['defaults', 'not IE 11'],
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
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@import "@/assets/styles/main.scss";',
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 500,
      minify: 'terser',
      cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      terserOptions: {
        compress: {
          // warnings: false,
          drop_console: true, // 打包时删除console
          drop_debugger: true, // 打包时删除 debugger
          pure_funcs: ['console.log'],
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
            vue: ['vue', 'vue-router', 'element-plus'],
          },
          entryFileNames,
          assetFileNames: processAssetFileNames,
          chunkFileNames,
        },
      },
      brotliSize: false,
      optimizeDeps: {
        include: ['vue', 'vue-router', 'element-plus'],
      },
    },
  }
})
