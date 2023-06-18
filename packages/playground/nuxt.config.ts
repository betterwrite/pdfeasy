// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  },
  devtools: { enabled: true }
})
