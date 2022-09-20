import pdfeasy from '../runner/pdfeasy'
import { ContentImage, ContentText } from '../pipe/factory'
import { getCorrectFontFamily } from '../pipe/transform'
import { getImageRaw } from '../content/image'

export interface PluginPageTextOptions {
  /**
   * @default auto
   */

  x?: number
  /**
   * @default auto
   */

  y?: number

  /**
   * A Text height anchor point
   *
   * @default center
   */
  heightAnchor?: 'top' | 'center' | 'bottom'

  /**
   * A Text width anchor point
   *
   * @default center
   */
  widthAnchor?: 'left' | 'center' | 'right'
}

export interface PluginPageImageOptions {}

export interface PluginGenerate {
  Text: (
    text: string,
    style: ContentText,
    options: PluginPageTextOptions
  ) => void
  Image: (
    raw: string,
    style: ContentImage,
    options: PluginPageImageOptions
  ) => Promise<void>
}

export const generate = (instance: pdfeasy): PluginGenerate => {
  const kit = instance.pdfkit as PDFKit.PDFDocument

  const defaults = instance.def

  const Text = (
    text: string,
    style: ContentText,
    options: PluginPageTextOptions
  ): void => {
    let _anchorTextWidth: number
    let _anchorTextHeight: number

    switch (options.widthAnchor) {
      case 'center':
        _anchorTextWidth = kit.widthOfString(text) / 2
        break
      case 'left':
        _anchorTextWidth = kit.widthOfString(text)
        break
      case 'right':
        _anchorTextWidth = 0
        break
      default:
        // default is center
        _anchorTextWidth = kit.widthOfString(text) / 2
        break
    }

    switch (options.heightAnchor) {
      case 'center':
        _anchorTextHeight = kit.heightOfString(text) / 2
        break
      case 'top':
        _anchorTextHeight = kit.heightOfString(text)
        break
      case 'bottom':
        _anchorTextHeight = 0
        break
      default:
        // default is center
        _anchorTextHeight = kit.heightOfString(text) / 2
        break
    }

    kit
      .font(getCorrectFontFamily(style.font || defaults.text.font, style))
      .fontSize(style.fontSize || defaults.text.fontSize)
      .fillColor(style.color || defaults.text.color)
      .fillOpacity(style.opacity || defaults.text.opacity)
      .text(
        text,
        options.x ? options.x - _anchorTextWidth : undefined,
        options.y ? options.y - _anchorTextHeight : undefined,
        {
          lineBreak: false,
          indent: style.indent || defaults.text.indent,
          align: style.align || defaults.text.align,
          paragraphGap: style.paragraphMargin || defaults.text.paragraphMargin,
          lineGap: style.lineHeight || defaults.text.lineHeight,
          destination: style.destination || defaults.text.destination,
          goTo: style.go || defaults.text.go,
        }
      )
  }

  const Image = async (
    str: string,
    style: ContentImage,
    options: PluginPageImageOptions
  ): Promise<void> => {
    if (!str) return

    const { raw } = await getImageRaw(str)

    kit.image(
      raw,
      style.x || 0,
      style.y || 0,
      style.size
        ? {
            width: style.size?.width || kit.page.width,
            height: style.size?.height || undefined,
            scale: style.size?.scale || 1,
          }
        : { width: kit.page.width, height: kit.page.height }
    )
  }

  return { Text, Image }
}

export const pageHandler = (instance: pdfeasy): Promise<void> => {
  return new Promise(async (response, reject) => {
    const doc = instance.pdfkit

    if (!doc) {
      reject('PDFKit not exists.')
      return
    }

    if (!instance.options?.plugins) {
      response()
      return
    }

    const range = doc.bufferedPageRange()

    let actually: number, total: number

    for (
      actually = range.start,
        total = range.start + range.count,
        range.start <= total;
      actually < total;
      actually++
    ) {
      if (!instance.options?.plugins) return

      doc.switchToPage(actually)

      for (const plugin of instance.options.plugins) {
        if (!plugin.page) return

        for (const page of plugin.page) {
          page &&
            (await page(
              generate(instance),
              instance.pdfkit?.page as PDFKit.PDFPage,
              actually + 1,
              total
            ))
        }
      }
    }

    response(doc.flushPages())
  })
}
