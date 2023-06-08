import { defineNuxtPlugin } from '#app'
import PDFEASY from 'pdfeasy'

export default defineNuxtPlugin(({ provide }) => {
  // @ts-expect-error
  provide('pdf', PDFEASY.default as typeof PDFEASY)
})
