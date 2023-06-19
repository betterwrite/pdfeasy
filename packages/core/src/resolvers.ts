import { RunOptions } from './types'
import { isBrowser } from './utils'
import type {
  Content,
  ContentText,
  ContentImage,
  PDFEasyDefaults,
  InternalGlobals,
  RunOptionsBase,
  Color,
  Fonts,
  FontKey,
  ContentQRCode,
} from './types'
import type PDFDocumentWithTables from 'pdfkit-table'
import QRCode from 'qrcode'
import { HEXToCMYK } from './schemas'
import { getRequestImageRaw } from './http'

export const resolveRunnerOptions = (
  options: Partial<RunOptions>
): RunOptions => {
  return {
    type: options.type || isBrowser ? 'client' : 'server',
    clientEmit: options.clientEmit || 'blob',
    serverPath: options.serverPath || '/',
    colorSchema: options.colorSchema || 'RGB',
    cwd: options?.cwd || !isBrowser ? process.cwd() : '/',
  }
}

export const resolveColor = (color: Color, run: RunOptionsBase) => {
  return run?.colorSchema === 'CMYK' ? HEXToCMYK(color) : color
}

export const resolveCover = async (app: PDFKit.PDFDocument, based: string) => {
  const { raw } = await getRequestImageRaw(based)

  app.image(raw, 0, 0, {
    height: app.page.height,
    width: app.page.width,
  })

  app.flushPages()
}

export const resolveContent = async (
  app: PDFDocumentWithTables,
  defaults: PDFEasyDefaults,
  content: Content,
  globals: InternalGlobals,
  run: RunOptionsBase
) => {
  const possibleLastPos = globals.__LAST_POSITION__

  let position =
    typeof content !== 'string' && content?.position
      ? { x: app.x + content.position.x, y: app.y + content.position.y }
      : { x: app.x, y: app.y }

  if (possibleLastPos) {
    position.x -= possibleLastPos.x
    position.y -= possibleLastPos.y

    globals.__LAST_POSITION__ = null
  }

  const addOnlyStringText = async (str: string) => {
    await app.text(str, position.x, position.y, {
      indent: defaults.text.indent,
      align: defaults.text.align,
      paragraphGap: defaults.text.paragraphMargin,
      lineGap: defaults.text.lineHeight,
      destination: defaults.text.destination,
      goTo: defaults.text.go,
    })
  }

  if (typeof content === 'string') {
    await addOnlyStringText(content)

    return
  }

  const addStack = async () => {
    const stack = content.stack as Content[]

    await stack.forEach(async (entity) => {
      if (typeof entity === 'string') {
        await addOnlyStringText(entity)

        return
      }

      if (!entity.text || !entity.raw) return

      const isLast = stack.length - 1 === stack.indexOf(entity)

      app
        .font(
          resolveFontFamily(entity.text.font || defaults.text.font, entity.text)
        )
        .fontSize(entity.text.fontSize || defaults.text.fontSize)
        .fillColor(resolveColor(entity.text.color || defaults.text.color, run))
        .fillOpacity(entity.text.opacity || defaults.text.opacity)
        .text(entity.raw, position.x, position.y, {
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

    const data = embed ? ` ${raw || content.raw}` : raw || content.raw

    await app
      .font(resolveFontFamily(style?.font || defaults.text.font, style))
      .fontSize(style?.fontSize || defaults.text.fontSize)
      .fillColor(resolveColor(style?.color || defaults.text.color, run))
      .fillOpacity(style?.opacity || defaults.text.opacity)
      .text(data, position.x, position.y, {
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
      .font(resolveFontFamily(defaults.text.font, {}))
      .fontSize(defaults.text.fontSize)
      .fillColor(resolveColor(defaults.text.color, run))
      .fillOpacity(defaults.text.opacity)
      .text(content.raw, position.x, position.y, {
        indent: defaults.text.indent,
        align: defaults.text.align,
        paragraphGap: defaults.text.paragraphMargin,
        lineGap: defaults.text.lineHeight,
        destination: defaults.text.destination,
        goTo: defaults.text.go,
      })
  }

  const addImage = async (external?: string) => {
    const style = content.svg
      ? content.svg
      : content.qrcode
      ? (content.qrcode as ContentQRCode)
      : (content.image as ContentImage)

    const target = external || content.raw

    if (!target) return

    const { raw } = content.svg
      ? await resolveSvgToPNG(target)
      : await getRequestImageRaw(target)

    app.image(
      raw,
      style?.x || position.x || undefined,
      style?.y || position.y || undefined,
      !style?.size
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
      content.checkbox?.backgroundColor || defaults.checkbox.backgroundColor,
      run
    )
    const borderColor = resolveColor(
      content.checkbox?.borderColor || defaults.checkbox.borderColor,
      run
    )
    const size = content.checkbox?.size || defaults.checkbox.size

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
        .circle(position.x + 4, position.y + 6, 3)
        .lineWidth(1)
        .fill(resolveColor('#000000', run))

      await addText(false, `    ${content.raw}`)
    }
  }

  const addTable = async () => {
    const options = content.table?.options || {}
    const table = content.table?.body

    options.width =
      options?.width ||
      app.page.width - (app.page.margins.left + app.page.margins.right)
    table?.headers?.map((header) => {
      if (typeof header === 'string') return header

      return {
        x: position.x,
        y: position.y,
        align: header.align,
        headerAlign: header.headerAlign,
        headerColor: resolveColor(header.headerColor || '#FFFFFF', run),
        headerOpacity: header.headerOpacity,
        columnColor: resolveColor(header.columnColor || '#000000', run),
        columnOpacity: header.columnOpacity,
        label: header.label,
        property: header.property,
        renderer: header.renderer,
        valign: header.valign,
        width: header.width,
      }
    })

    if (!table) {
      return
    }

    try {
      await app.table(table, options)
    } catch (e) {}
  }

  const addFormulary = async () => {
    if (!content.form || content.form?.length === 0) return

    console.warn(
      "[PDFEASY]: Formulary block is under construction. Don't use this in production."
    )

    app.initForm()

    for (const item of content.form) {
      const width =
        item.options?.width ||
        app.page.width - (app.page.margins.left + app.page.margins.right)
      const height = item.options?.height || 20

      const opts = item.options || {}
      opts.value = opts?.value || ''
      opts.backgroundColor = resolveColor(
        item.options?.backgroundColor || '#FFFFFF',
        run
      )
      opts.borderColor = resolveColor(
        content.checkbox?.borderColor || '#000000',
        run
      )

      switch (item.type) {
        case 'text': {
          await app.formText(
            item.name,
            position.x,
            position.y,
            width,
            height,
            opts
          )

          break
        }
        case 'combo': {
          await app.formCombo(
            item.name,
            position.x,
            position.y,
            width,
            height,
            opts
          )

          break
        }
        case 'list': {
          await app.formList(
            item.name,
            position.x,
            position.y,
            width,
            height,
            opts
          )

          break
        }
        case 'button': {
          await app.formPushButton(
            item.name,
            position.x,
            position.y,
            width,
            height,
            opts
          )

          break
        }
      }
    }
  }

  const addQRCode = async () => {
    if (!content.raw) return

    try {
      const qrcode = await QRCode.toDataURL(content.raw)

      await addImage(qrcode)
    } catch (err) {
      console.warn('[PDFEASY]: Unexpected QRCode gen.')
    }
  }

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

  if (
    !content.stack &&
    !content.text &&
    !content.image &&
    !content.svg &&
    !content.lineBreak &&
    !content.pageBreak &&
    !content.table &&
    !content.form &&
    !content.checkbox &&
    !content.position &&
    !content.qrcode &&
    content.raw
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
  if (content.form) await addFormulary()
  if (content.qrcode) await addQRCode()
}

export const resolveFontFamily = (
  font: Fonts,
  options?: ContentText
): Fonts => {
  if (font === 'Symbol' || font === 'ZapfDingbats') return font

  if (options?.italic && options?.bold) {
    if (font === 'Times-Roman') return 'Times-BoldItalic'

    return (font + '-BoldOblique') as Fonts
  }

  if (options?.italic) {
    if (font === 'Times-Roman') return 'Times-Italic'

    return (font + '-Oblique') as Fonts
  }

  if (options?.bold) {
    if (font === 'Times-Roman') return 'Times-Bold'

    return (font + '-Bold') as Fonts
  }

  return font
}

export const resolveFontName = (name: string, type: FontKey) => {
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

export const resolveSvgToPNG = (raw: string): Promise<{ raw: string }> => {
  return new Promise((res, rej) => {
    const set = !raw.includes('<svg xmlns="http://www.w3.org/2000/svg"')
      ? raw.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg"')
      : raw

    const blob = new Blob([set], {
      type: 'image/svg+xml;charset=utf-8',
    })

    const URL = window.URL || window.webkitURL || window

    const blobURL = URL.createObjectURL(blob)

    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = 2000
      canvas.height = 2000

      const context = canvas.getContext('2d') as CanvasRenderingContext2D

      context.drawImage(image, 0, 0, 2000, 2000)

      const url = canvas.toDataURL('image/png')

      res({ raw: url })
    }
    image.onerror = () => {
      rej()
    }

    // TODO: other blob performatic method
    image.src = blobURL
  })
}
