import { PluginGenerate } from './page'

export interface Plugin {
  background?: PluginBackgroundCallback<string | false>
  page?: PluginPageCallback<void>[]
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
