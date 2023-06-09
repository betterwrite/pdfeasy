import { defineNuxtPlugin } from '#app'
import { PDFEasy } from 'pdfeasy'

export default defineNuxtPlugin(({ provide }) => {
  provide('pdf', new PDFEasy())
})
