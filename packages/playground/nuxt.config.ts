// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      siteUrl: 'https://betterwrite.github.io/pdfeasy/',
      siteName: 'PDFEasy Playground',
      siteDescription: 'Test pdfeasy npm package without install it!',
      language: 'en-US',
    }
  },
  app: {
    baseURL: '/pdfeasy/'
  },
  extends: [
    'nuxt-seo-kit'
  ],
  modules: [
    'nuxt-pdfeasy',
    'nuxt-monaco-editor',
    '@unocss/nuxt',
    '@vueuse/nuxt'
  ],
  unocss: {
    preflight: true,
    webFonts: {
      fonts: {
        poppins: 'Poppins',
        raleway: 'Raleway'
      }
    },
    theme: {
      colors: {
        'primary': '#121212',
        'secondary': '#161616'
      },
    }
  }
})
