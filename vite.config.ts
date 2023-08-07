import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compression from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'
import ElementPlus from 'unplugin-element-plus/vite'
import { chunkFileNames, entryFileNames, processAssetFileNames } from './vite/build-assetdir'

export default defineConfig(({ mode }) => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  return {
    plugins: [
      vue(),
      vueJsx({}),
      ElementPlus({}),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      compression({
        // 可选配置项
        ext: '.gz', // 压缩文件的扩展名，默认为 .gz
        algorithm: 'gzip', // 压缩算法，可以是 'gzip' 或 'brotliCompress'
        threshold: 10240, // 超过多少字节的文件才会被压缩，默认为 0
        deleteOriginFile: false, // 是否删除原始文件，默认为 false
        verbose: true, // 是否在控制台输出压缩结果，默认为 false
        filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 指定哪些资源不被压缩，默认为 /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
        disable: false, // 是否禁用插件，默认为 false
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
    },
  }
})
