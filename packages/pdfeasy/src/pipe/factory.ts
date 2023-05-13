import type {
  Content,
  ContentText,
  ContentImage,
  PDFEasyDefaults,
  InternalGlobals,
  HexColor,
  RunOptionsBase,
} from '../types'
import { getCorrectFontFamily } from './transform'
import { getImageRaw, SvgToPNG } from '../content/image'
import { HEXToCMYK } from 'src/schema/color'

export const resolveColor = (color: HexColor, run: RunOptionsBase) => {
  return run?.colorSchema === 'CMYK' ? HEXToCMYK(color) : color
}

export const resolveCover = async (app: PDFKit.PDFDocument, based: string) => {
  const { raw } = await getImageRaw(based)

  app.image(raw, 0, 0, {
    height: app.page.height,
    width: app.page.width,
  })

  app.flushPages()
}

export const resolveContent = async (
  app: PDFKit.PDFDocument,
  defaults: PDFEasyDefaults,
  content: Content,
  globals: InternalGlobals,
  run: RunOptionsBase
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
        .fillColor(resolveColor(entity.text.color || defaults.text.color, run))
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

  const addText = async (embed: boolean = false, raw?: string) => {
    const style = content.text as ContentText

    if (!content.raw) return

    const data = embed ? ` ${raw ?? content.raw}` : raw ?? content.raw

    await app
      .font(getCorrectFontFamily(style?.font || defaults.text.font, style))
      .fontSize(style?.fontSize || defaults.text.fontSize)
      .fillColor(resolveColor(style?.color || defaults.text.color, run))
      .fillOpacity(style?.opacity || defaults.text.opacity)
      .text(data, {
        indent: style?.indent || defaults.text.indent,
        align: style?.align || defaults.text.align,
        paragraphGap: style?.paragraphMargin || defaults.text.paragraphMargin,
        lineGap: style?.lineHeight || defaults.text.lineHeight,
        destination: style?.destination || defaults.text.destination,
        goTo: style?.go || defaults.text.go,
      })
  }

  const addSimpleText = async () => {
    if (!content.raw) return

    await app
      .font(getCorrectFontFamily(defaults.text.font, {}))
      .fontSize(defaults.text.fontSize)
      .fillColor(resolveColor(defaults.text.color, run))
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

  const addLineBreak = async () => {
    const lineGap = content.lineBreak?.spacing
      ? content.lineBreak.spacing
      : defaults.lineBreak.spacing

    await app.fontSize(defaults.text.fontSize).text(' ', {
      lineGap,
    })
  }

  const addPageBreak = async () => {
    const maxPages = content.pageBreak?.pages
      ? content.pageBreak.pages
      : defaults.pageBreak.pages

    for (let i = 1; i <= maxPages; i++) {
      await app.addPage()
    }
  }

  const addCheckbox = async () => {
    const backgroundColor = resolveColor(
      content.checkbox?.backgroundColor ?? defaults.checkbox.backgroundColor,
      run
    )
    const borderColor = resolveColor(
      content.checkbox?.borderColor ?? defaults.checkbox.borderColor,
      run
    )
    const size = content.checkbox?.size ?? defaults.checkbox.size

    app.initForm()

    app.formCheckbox('checked', app.x, app.y, size, size, {
      backgroundColor,
      borderColor,
    })

    await addText(true)
  }

  const addList = async () => {
    const style = content.list?.style

    if (style === 'counter') {
      const [type, value] = globals.__LAST_TYPE__

      await addText(false, `${type === 'list' ? value : 1}. ${content.raw}`)
    } else {
      app
        .circle(app.x + 4, app.y + 6, 3)
        .lineWidth(1)
        .fill(resolveColor('#000000', run))

      await addText(false, `    ${content.raw}`)
    }
  }

  const addTable = async () => {}

  if (
    !content.stack &&
    !content.text &&
    !content.image &&
    !content.svg &&
    content.lineBreak &&
    content.pageBreak
  ) {
    addSimpleText()
    return
  }

  if (content.stack) await addStack()
  if (content.text) await addText()
  if (content.image || content.svg) await addImage()
  if (content.lineBreak) await addLineBreak()
  if (content.pageBreak) await addPageBreak()
  if (content.checkbox) await addCheckbox()
  if (content.list) await addList()
  if (content.table) await addTable()
}
