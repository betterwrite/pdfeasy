import { resolve } from 'path'
import { defineConfig } from 'vite'
import ViteFonts from 'vite-plugin-fonts'
import WindiCSS from 'vite-plugin-windicss'
import ViteRestart from 'vite-plugin-restart'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, '.vitepress/theme')}/`,
    },
  },
  build: {
    chunkSizeWarningLimit: 3000, // pdfeasy :(
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          windicss: ['windicss'],
        },
      },
    },
  },
  plugins: [
    Components({
      dirs: ['.vitepress/theme/components'],
      extensions: ['vue', 'ts'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: true,
    }),
    ViteFonts({
      google: {
        families: ['Raleway'],
      },
    }),
    ViteRestart({
      restart: ['.vitepress/*.*'],
    }),
    WindiCSS(),
  ],
})
