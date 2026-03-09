import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pxtorem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  base: '/lwt/',
  plugins: [react()],
  server: {
    proxy: {
      '/backend': {
        target: 'https://test-api.yicall.com',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 100, // 设计稿440px -> 对应的基准是 100px = 1rem
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: ['ignore', 'hairline'],
          replace: true,
          mediaQuery: false,
          minPixelValue: 2, // 1px 不被转换，保证边框
        })
      ]
    }
  }
})
