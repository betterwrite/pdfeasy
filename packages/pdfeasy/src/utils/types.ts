import PDFDocument from 'pdfkit'
import { RunnerOptions, RunOptions } from '../runner/pdfeasy'
import { PluginGenerate } from '../plugins/page'

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
export type Fonts<T = string> = LocalFonts | T

export type PDFRunEmitOption = 'save' | 'blob' | 'none'

export type TextAlign = 'start' | 'center' | 'end' | 'justify'

export type EmitterType = {}
