import { defineNuxtPlugin } from '#app'
import PDFEASY from 'pdfeasy'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      pdf: PDFEASY as typeof PDFEASY
    }
  }
})
