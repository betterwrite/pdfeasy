// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/pdfeasy/'
  },
  modules: [
    'nuxt-pdfeasy',
    '@unocss/nuxt',
    '@vueuse/nuxt',
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
