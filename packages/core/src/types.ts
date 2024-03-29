import type PDFDocumentWithTables from 'pdfkit-table'

/* pdfkit-table */
interface TableRect {
  x: number
  y: number
  width: number
  height: number
}

interface TableHeader {
  label?: string
  property?: string
  width?: number
  align?: string //default 'left'
  valign?: string
  headerColor?: string //default '#BEBEBE'
  headerOpacity?: number //default '0.5'
  headerAlign?: string //default 'left'
  columnColor?: string
  columnOpacity?: number
  renderer?: (
    value: any,
    indexColumn?: number,
    indexRow?: number,
    row?: number,
    rectRow?: TableRect,
    rectCell?: TableRect
  ) => string
}

interface TableDataOptions {
  fontSize: number
  fontFamily: string
  separation: boolean
}

interface TableData {
  [key: string]: string | { label: string; options?: TableDataOptions }
}

interface TableBody {
  title?: string
  subtitle?: string
  headers?: (string | TableHeader)[]
  datas?: TableData[]
  rows?: string[][]
}

interface TableDividerOptions {
  disabled?: boolean
  width?: number
  opacity?: number
}

interface TableDivider {
  header?: TableDividerOptions
  horizontal?: TableDividerOptions
}

interface TableTitle {
  label: string
  fontSize?: number
  fontFamily?: string
  color?: string
}

interface TableOptions {
  title?: string | TableTitle
  subtitle?: string | TableTitle
  width?: number
  x?: number //default doc.x
  y?: number //default doc.y
  divider?: TableDivider
  columnsSize?: number[]
  columnSpacing?: number //default 5
  padding?: number[]
  addPage?: boolean //default false
  hideHeader?: boolean
  minRowHeight?: number
  prepareHeader?: () => PDFDocumentWithTables
  prepareRow?: (
    row?: any,
    indexColumn?: number,
    indexRow?: number,
    rectRow?: TableRect,
    rectCell?: TableRect
  ) => PDFDocumentWithTables
}

export interface FormularyCommonOptions {
  required?: boolean
  noExport?: boolean
  readOnly?: boolean
  value?: number | string
  defaultValue?: number | string
  width?: number
  height?: number
  backgroundColor?: Color
  borderColor?: Color
}

export interface FormularyTextOptions extends FormularyCommonOptions {
  align?: string
  multiline?: boolean
  password?: boolean
  noSpell?: boolean
  format?: Record<any, any>
}

export interface FormularyComboAndListOptions extends FormularyCommonOptions {
  sort?: boolean
  edit?: boolean
  multiSelect?: boolean
  noSpell?: boolean
  select?: Array<any>
}

export interface FormularyButtonOptions extends FormularyCommonOptions {
  /* Sets the label text. You can also set an icon, but for this you will need to 'expert-up' and dig deeper into the PDF Reference manual. */
  label: string
}

export type DocBase = PDFDocumentWithTables | null

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

export type FontKey = 'normal' | 'italic' | 'bold' | 'bolditalic'

export type ItemType =
  | 'paragraph'
  | 'image'
  | 'list'
  | 'checkbox'
  | 'table'
  | 'svg'
  | 'line-break'
  | 'page-break'
  | 'form'
  | 'qrcode'

export type PDFRunEmitOption = 'save' | 'blob' | 'open-link' | 'none'

export type TextAlign = 'start' | 'center' | 'end' | 'justify'

export type ColorSchema = 'RGB' | 'CMYK'

export type HexColor = string | `#${string}`

export type Color = HexColor | [number, number, number, number]

export type EmitterType = {}

export interface InternalGlobals {
  __NEW_PAGE__: boolean
  PLUGIN: {
    __BACKGROUND_RAW__: string
  }
  __LAST_TYPE__: [ItemType, number]
  __LAST_CONTENT__: Record<any, any> | string
  __LAST_POSITION__: { x: number; y: number } | null
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

export interface ContentText extends Partial<DefaultsText> {}

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
  body: TableBody
  options: TableOptions
}

export interface ContentQRCode {
  x?: number
  y?: number
  size?: {
    width?: number
    height?: number
    scale?: number
  }
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

export type ContentFormularyType = 'text' | 'button' | 'combo' | 'list'

export interface ContentFormulary<T extends ContentFormularyType> {
  name: string
  type: T
  options?: T extends 'text'
    ? FormularyTextOptions
    : T extends 'button'
    ? FormularyButtonOptions
    : T extends 'combo' | 'list'
    ? FormularyComboAndListOptions
    : never
}

export interface ContentObject {
  raw?: string
  position?: { x: number; y: number }
  stack?: Content[]
  text?: ContentText
  image?: ContentImage
  svg?: ContentSVG
  lineBreak?: ContentLineBreak
  pageBreak?: ContentPageBreak
  checkbox?: ContentCheckbox
  list?: ContentList
  table?: ContentTable
  form?: ContentFormulary<ContentFormularyType>[]
  qrcode?: ContentQRCode
}

export type Content = ContentObject | string

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
  type: 'client' | 'server' | 'auto'
  /**
   *  Client type format emitter
   *  @default 'blob'
   */
  clientEmit: PDFRunEmitOption
  /**
   *  Server file destination
   *
   *  Required in {@link RunOptions} type: server
   */
  serverPath: string
  /**
   *  Color schema
   *
   *  @default 'rgb'
   */
  colorSchema: ColorSchema
  /**
   *  CWD for Server-Side Setup
   *
   *  @default 'process.cwd()'
   */
  cwd: string
}
