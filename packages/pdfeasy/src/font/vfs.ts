import pdfeasy from '../runner/pdfeasy'
import path from 'path'
import { getBase64ByURL } from '../utils/request'
import { regex } from '../utils/defines'

export const getFontCorrectName = (
  name: string,
  type: 'normal' | 'italic' | 'bold' | 'bolditalic'
) => {
  switch (type) {
    case 'normal':
      return name
    case 'italic':
      return name + '-Oblique'
    case 'bold':
      return name + '-Bold'
    case 'bolditalic':
      return name + '-BoldOblique'
    default:
      return name
  }
}

export const setServerPath = (p: string) => {
  return path.join(process.cwd() + `/${p}`)
}

export const setExternalFonts = async (instance: pdfeasy) => {
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
    instance.optionsRun?.type === 'server' && !regex().http(font)

  for (const font of instance.fonts) {
    const normal = await getBase64ByURL(
      isLocalServer(font.normal) ? setServerPath(font.normal) : font.normal,
      'arraybuffer'
    )
    const italic = await getBase64ByURL(
      isLocalServer(font.italic) ? setServerPath(font.italic) : font.italic,
      'arraybuffer'
    )
    const bold = await getBase64ByURL(
      isLocalServer(font.bold) ? setServerPath(font.bold) : font.bold,
      'arraybuffer'
    )
    const bolditalic = await getBase64ByURL(
      isLocalServer(font.bolditalic)
        ? setServerPath(font.bolditalic)
        : font.bolditalic,
      'arraybuffer'
    )

    await instance.pdfkit?.registerFont(
      getFontCorrectName(font.name, 'normal'),
      normal
    )
    await instance.pdfkit?.registerFont(
      getFontCorrectName(font.name, 'italic'),
      italic
    )
    await instance.pdfkit?.registerFont(
      getFontCorrectName(font.name, 'bold'),
      bold
    )
    await instance.pdfkit?.registerFont(
      getFontCorrectName(font.name, 'bolditalic'),
      bolditalic
    )
  }
}
