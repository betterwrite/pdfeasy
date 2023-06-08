import { defineNuxtPlugin } from '#app'
import PDFEASY from 'pdfeasy'

export default defineNuxtPlugin(({ provide }) => {
  provide('pdf', PDFEASY as typeof PDFEASY)
})
