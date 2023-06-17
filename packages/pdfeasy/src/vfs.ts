import { getBase64ByURL } from './http'
import { PDFEasy } from './runner'
import path from 'path'
import { regex } from './utils'
import { resolveFontName } from './resolvers'

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
    const normal = await getBase64ByURL(
      isLocalServer(font.normal) ? fontTarget(font.normal) : font.normal,
      'arraybuffer'
    )
    const italic = await getBase64ByURL(
      isLocalServer(font.italic) ? fontTarget(font.italic) : font.italic,
      'arraybuffer'
    )
    const bold = await getBase64ByURL(
      isLocalServer(font.bold) ? fontTarget(font.bold) : font.bold,
      'arraybuffer'
    )
    const bolditalic = await getBase64ByURL(
      isLocalServer(font.bolditalic)
        ? fontTarget(font.bolditalic)
        : font.bolditalic,
      'arraybuffer'
    )

    await instance.pdfkit?.registerFont(
      resolveFontName(font.name, 'normal'),
      normal
    )
    await instance.pdfkit?.registerFont(
      resolveFontName(font.name, 'italic'),
      italic
    )
    await instance.pdfkit?.registerFont(
      resolveFontName(font.name, 'bold'),
      bold
    )
    await instance.pdfkit?.registerFont(
      resolveFontName(font.name, 'bolditalic'),
      bolditalic
    )
  }
}
