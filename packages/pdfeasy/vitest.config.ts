/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['src'],
      exclude: ['examples', 'dist', 'scripts', 'node_modules']
    }
  },
})