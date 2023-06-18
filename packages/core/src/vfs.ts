import { getBase64ByURL } from './http'
import { PDFEasy } from './runner'
import path from 'path'
import { regex } from './utils'
import { resolveFontName } from './resolvers'
import { FontKey } from './types'

export const setExternalFonts = async (instance: PDFEasy) => {
  const fontTarget = (str: string) =>
    path.resolve(instance.runOptions?.cwd + `/${str}`)

  if (instance.options?.advanced?.fontsPurge) {
    const allContentFonts: string[] = []

    instance.contents.forEach((content) => {
      if (content.text?.font) allContentFonts.push(content.text?.font)
      if (content.stack) {
        content.stack.forEach((_content) => {
          if (_content.text?.font) allContentFonts.push(_content.text?.font)
        })
      }
    })

    const unique = allContentFonts.filter((v, i, a) => a.indexOf(v) === i)

    instance.fonts =
      instance.fonts.filter((font) => unique.includes(font.name)) || []
  }

  const isLocalServer = (font: string) =>
    instance.runOptions?.type === 'server' && !regex().http(font)

  for (const font of instance.fonts) {
    const keys = ['normal', 'italic', 'bold', 'bolditalic'] as FontKey[]

    for (const key of keys) {
      const item = font[key]

      const url = await getBase64ByURL(
        isLocalServer(item) ? fontTarget(item) : item,
        'arraybuffer'
      )

      await instance.pdfkit?.registerFont(resolveFontName(font.name, key), url)
    }
  }
}
