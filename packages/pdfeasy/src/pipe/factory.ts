import { PDFEasyDefaults } from '../utils/defines'
import { getDataUri } from '../utils/request'
import { Fonts, TextAlign } from '../utils/types'
import { getCorrectFontFamily } from './transform'
import { getImageRaw, SvgToPNG } from '../content/image'

export interface ContentText {
  fontSize?: number
  font?: Fonts
  color?: string
  indent?: number
  align?: TextAlign
  paragraphMargin?: number
  lineHeight?: number
  opacity?: number
  destination?: string
  go?: string
  bold?: boolean
  italic?: boolean
}

export interface DefaultsText {
  fontSize: number
  font: Fonts
  color: string
  indent: number
  align: TextAlign
  paragraphMargin: number
  lineHeight: number
  opacity: number
  destination: string | undefined
  go: string | undefined
  bold: boolean
  italic: boolean
}

export interface ContentImage {
  x?: number
  y?: number
  size?: {
    width?: number
    height?: number
    scale?: number
  }
}

export interface ContentSVG extends ContentImage {
  size?: {
    width?: number
    height?: number
    scale?: number
  }
}

export interface Content {
  raw?: string
  stack?: Content[]
  text?: ContentText
  image?: ContentImage
  svg?: ContentSVG
}

export const resolveContent = async (
  app: PDFKit.PDFDocument,
  defaults: PDFEasyDefaults,
  content: Content
) => {
  const addStack = async () => {
    const stack = content.stack as Content[]

    await stack.forEach((entity) => {
      if (!entity.text || !entity.raw) return

      const isLast = stack.length - 1 === stack.indexOf(entity)

      app
        .font(
          getCorrectFontFamily(
            entity.text.font || defaults.text.font,
            entity.text
          )
        )
        .fontSize(entity.text.fontSize || defaults.text.fontSize)
        .fillColor(entity.text.color || defaults.text.color)
        .fillOpacity(entity.text.opacity || defaults.text.opacity)
        .text(entity.raw, {
          continued: !isLast,
          indent: entity.text.indent || defaults.text.indent,
          align: entity.text.align || defaults.text.align,
          paragraphGap:
            entity.text.paragraphMargin || entity.text.paragraphMargin,
          lineGap: entity.text.lineHeight || entity.text.lineHeight,
          destination: entity.text.destination,
          goTo: entity.text.go,
        })
    })
  }

  const addText = async () => {
    const style = content.text as ContentText

    if (!content.raw) return

    await app
      .font(getCorrectFontFamily(style.font || defaults.text.font, style))
      .fontSize(style.fontSize || defaults.text.fontSize)
      .fillColor(style.color || defaults.text.color)
      .fillOpacity(style.opacity || defaults.text.opacity)
      .text(content.raw, {
        indent: style.indent || defaults.text.indent,
        align: style.align || defaults.text.align,
        paragraphGap: style.paragraphMargin || defaults.text.paragraphMargin,
        lineGap: style.lineHeight || defaults.text.lineHeight,
        destination: style.destination || defaults.text.destination,
        goTo: style.go || defaults.text.go,
      })
  }

  const addSimpleText = async () => {
    if (!content.raw) return

    await app
      .font(getCorrectFontFamily(defaults.text.font, {}))
      .fontSize(defaults.text.fontSize)
      .fillColor(defaults.text.color)
      .fillOpacity(defaults.text.opacity)
      .text(content.raw, {
        indent: defaults.text.indent,
        align: defaults.text.align,
        paragraphGap: defaults.text.paragraphMargin,
        lineGap: defaults.text.lineHeight,
        destination: defaults.text.destination,
        goTo: defaults.text.go,
      })
  }

  const addImage = async () => {
    const style = content.svg ? content.svg : (content.image as ContentImage)

    if (!content.raw) return

    const { raw } = content.svg
      ? await SvgToPNG(content.raw)
      : await getImageRaw(content.raw)

    app.image(
      raw,
      style.x || undefined,
      style.y || undefined,
      !style.size
        ? {
            width:
              app.page.width - app.page.margins.left - app.page.margins.right,
          }
        : {
            width: style.size?.width || undefined,
            height: style.size?.height || undefined,
            scale: style.size?.scale || 1,
          }
    )
  }

  if (!content.stack && !content.text && !content.image && !content.svg) {
    addSimpleText()
    return
  }

  if (content.stack) await addStack()
  if (content.text) await addText()
  if (content.image || content.svg) await addImage()
}
