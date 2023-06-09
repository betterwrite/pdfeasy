import { defineNuxtPlugin } from '#app'
import { PDFEasy } from 'pdfeasy/dist/client.esm.js'

export default defineNuxtPlugin(({ provide }) => {
  provide('pdf', new PDFEasy())
})
