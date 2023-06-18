import { PDFEasy } from './runner'
import {
  ContentImage,
  ContentText,
  PluginPageImageOptions,
  PluginGenerate,
  PluginPageTextOptions,
} from './types'
import { regex } from './utils'
import { resolveFontFamily } from './resolvers'
import { getRequestImageRaw } from './http'

export const runPluginBackground = async (instance: PDFEasy) => {
  if (instance.options?.plugins) {
    for (const plugin of instance.options.plugins) {
      if (plugin.background && instance.globals.__NEW_PAGE__) {
        const res = plugin.background(instance.pdfkit!.page)

        if (res) await setBackground(instance, res)
      }
    }
  }

  instance.globals.__NEW_PAGE__ = false
}

export const generate = (instance: PDFEasy): PluginGenerate => {
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
        _anchorTextHeight = kit.heightOfString(text) / 2
        break
    }

    kit
      .font(resolveFontFamily(style.font || defaults.text.font, style))
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
    _: PluginPageImageOptions
  ): Promise<void> => {
    if (!str) return

    const { raw } = await getRequestImageRaw(str)

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

export const setBackground = async (instance: PDFEasy, str: string) => {
  if (!instance.pdfkit) return

  const kit = instance.pdfkit

  if (regex().hex(str)) {
    kit.rect(0, 0, kit.page.width, kit.page.height).fill(str)

    return
  }

  const backgroundPurge = instance.options?.advanced?.backgroundPurge
  const globalRaw = instance.globals.PLUGIN.__BACKGROUND_RAW__

  const { raw, type } = await getRequestImageRaw(
    backgroundPurge ? globalRaw || str : str
  )

  kit.image(raw, 0, 0, { width: kit.page.width, height: kit.page.height })

  if (backgroundPurge) {
    // define base64 instead http request
    instance.options?.plugins?.map((plugin) => {
      if (!globalRaw && type !== 'base64')
        instance.globals.PLUGIN.__BACKGROUND_RAW__ = raw

      return plugin
    })
  }
}

export const pageHandler = (instance: PDFEasy): Promise<void> => {
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
