import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { PDFEasy } from 'pdfeasy'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-pdfeasy',
    configKey: 'pdfeasy',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.build.transpile.push(runtimeDir)

    addPlugin(resolve(runtimeDir, 'plugin'))
  }
})

declare module '#app' {
  interface NuxtApp {
    $pdf: PDFEasy
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $pdf: PDFEasy
  }
}