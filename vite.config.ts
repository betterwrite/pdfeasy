import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'demo/',
  resolve: {
    alias: [
      {
        find: 'pdfeasy',
        replacement: resolve(__dirname, './dist/client.esm.js'),
      },
    ],
  },
})