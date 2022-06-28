import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@service': resolve(__dirname, 'src/service')
    }
  },
  base: './', // 打包路径
  server: {
    port: 4000, // 服务端口号
    open: true, // 服务启动时是否自动打开浏览器
    // cors: true // 允许跨域
    proxy: {
      '^/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
})
