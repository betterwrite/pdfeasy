import PDFDocument from 'pdfkit'

export type DocBase = typeof PDFDocument | null

export type RunnerBase = RunnerOptions | null

export type RunOptionsBase = RunOptions | null

export type LocalFonts =
  | 'Courier'
  | 'Courier-Bold'
  | 'Courier-Oblique'
  | 'Courier-BoldOblique'
  | 'Helvetica'
  | 'Helvetica-Bold'
  | 'Helvetica-Oblique'
  | 'Helvetica-BoldOblique'
  | 'Symbol'
  | 'Times-Roman'
  | 'Times-Bold'
  | 'Times-Italic'
  | 'Times-BoldItalic'
  | 'ZapfDingbats'

export type Fonts<T extends string = string> = LocalFonts | T

export type ItemType = 'paragraph' | 'image' | 'list' | 'checkbox' | 'table' | 'svg' | 'line-break' | 'page-break'

export type PDFRunEmitOption = 'save' | 'blob' | 'none'

export type TextAlign = 'start' | 'center' | 'end' | 'justify'

export type EmitterType = {}

export interface InternalGlobals {
  __NEW_PAGE__: boolean,
  PLUGIN: {
    __BACKGROUND_RAW__: string,
  },
  __LAST_TYPE__: [ItemType, number]
}

export interface ImageRaw {
  raw: string
  type: 'base64' | 'http'
}

export interface ExternalFont {
  name: string
  normal: string
  italic: string
  bold: string
  bolditalic: string
}

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

export interface ContentLineBreak {
  spacing?: number
}

export interface ContentPageBreak {
  pages?: number
}

export interface ContentCheckbox {
  borderColor?: string
  backgroundColor?: string
  size?: number
}

export interface ContentList {
  style: 'circle' | 'counter'
}

export interface ContentTable {
  
}

export interface DefaultsLineBreak {
  spacing: number
}

export interface DefaultsPageBreak {
  pages: number
}

export interface DefaultsCheckbox {
  borderColor: string
  backgroundColor: string
  size: number
}

export interface DefaultsList {
  style: 'circle' | 'counter'
}

export interface Content {
  raw?: string
  stack?: Content[]
  text?: ContentText
  image?: ContentImage
  svg?: ContentSVG
  lineBreak?: ContentLineBreak
  pageBreak?: ContentPageBreak
  checkbox?: ContentCheckbox
  list?: ContentList
  table?: ContentTable
}

export interface PDFEasyDefaults {
  text: DefaultsText
  lineBreak: DefaultsLineBreak
  pageBreak: DefaultsPageBreak
  checkbox: DefaultsCheckbox
  list: DefaultsList
}

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
    str: string,
    style: ContentImage,
    options: PluginPageImageOptions
  ) => Promise<void>
}

export interface Plugin {
  background?: PluginBackgroundCallback<string | false>
  page: PluginPageCallback<void>[]
  onAfter?: () => void
  onBefore?: () => void
}

export type PluginBackgroundCallback<T> = (context: PDFKit.PDFPage) => T

/**
 * A callback in every page
 *
 * @param generate - {@link PDFEasyGenerate}
 * @param context - A {@link PDFKit.PDFPage} access
 * @param actuallyPage - A number with actually buffer position
 * @param totalPages - A total of pages buffer
 */
export type PluginPageCallback<T> = (
  generate: PluginGenerate,
  context: PDFKit.PDFPage,
  actuallyPage: number,
  totalPages: number
) => T

export interface RunnerOptionsAdvanced {
  /**
   * Insert fonts only in add() contents.
   *
   * Recommended to avoid loading fonts unnecessarily in rendering.
   *
   * @default true
   */
  fontsPurge?: boolean

  /**
   * Save base64 transform of {@link PluginBackgroundCallback} after http request for otimize other callbacks
   *
   * @default true
   */
  backgroundPurge?: boolean
}

export interface RunnerOptionsExports {
  /**
   * A name of .pdf
   */
  name?: string
}

export interface RunnerOptions {
  /**
   * Cover URL or Base64
   */
  cover?: string

  /**
   * Advanced PDF Easy Options
   *
   *  We don't recommend changing them if you're not sure what doing.
   */
  advanced?: RunnerOptionsAdvanced

  /**
   *  {@link PDFKit} document options
   *
   */
  document?: PDFKit.PDFDocumentOptions

  /**
   *  Exports definitions to .pdf generate
   *
   */
  exports?: RunnerOptionsExports

  /**
   *  A page handler callback's
   */
  plugins?: Plugin[]
}

export interface RunOptions {
  /**
   *  Type runner
   *  @default 'client'
   */
  type?: 'client' | 'server'
  /**
   *  Client type format emitter
   *  @default 'blob'
   */
  clientEmit?: PDFRunEmitOption
  /**
   *  Server file destination
   *
   *  Required in {@link RunOptions} type: server
   */
  serverPath?: string
}
