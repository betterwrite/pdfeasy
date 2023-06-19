import PDFDocumentWithTables from 'pdfkit-table'
import blobStream from 'blob-stream'
import mitt from 'mitt'
import path from 'path'
import { saveAs } from 'file-saver'
import { resolveContent, resolveCover } from './resolvers'
import { pdfDefaults } from './utils'
import {
  Content,
  DocBase,
  EmitterType,
  PDFRunEmitOption,
  RunnerBase,
  RunOptionsBase,
  ExternalFont,
  PDFEasyDefaults,
  InternalGlobals,
  ItemType,
} from './types'
import { setExternalFonts } from './vfs'
import { createWriteStream } from 'fs'
import { RunnerOptions, RunOptions } from './types'
import { onPageAdded } from './events'
import { resolveRunnerOptions } from 'src/resolvers'
import { pageHandler, runPluginBackground } from './plugins'

/**
 *  A Base PDFEasy Runner
 */
export class PDFEasy {
  /**
   * A internal emitter.
   *
   * @private
   */
  public emitter = mitt<EmitterType>()
  /**
   *  A Content Runner
   *
   * @public
   * @returns Promise<void>
   */
  public contents: Array<Content> = []

  /**
   *  {@link PDFKit} document options
   *
   *  @public
   */
  public pdfkit: DocBase = null

  /**
   *  {@link RunnerOptions} document options
   *
   *  @public
   */
  public options: RunnerBase = null

  /**
   *  {@link RunOptions} document options
   *
   *  @public
   */
  public runOptions: RunOptionsBase = null

  /**
   *  {@link PDFKit} document options
   *
   *  @public
   */
  public def: PDFEasyDefaults = pdfDefaults()

  /**
   *  External fonts with pdfeasy.addFonts()
   *
   * @example
   * ```ts
   * pdfeasy.addFonts({
   *    name: 'Roboto',
   *    normal: 'https://path/to/Roboto/Roboto-Regular.ttf',
   *    bold: 'https://path/to/fonts/Roboto/Roboto-Medium.ttf',
   *    italic: 'https://path/to/fonts/Roboto/Roboto-Italic.ttf',
   *    bolditalic: 'https://path/to/fonts/Roboto/Roboto-MediumItalic.ttf'
   * })
   * ```
   *
   *  @public
   */
  public fonts: ExternalFont[] = []

  /**
   * A global setter for internal flags
   *
   * @private
   */
  public globals: InternalGlobals = {
    __NEW_PAGE__: true,
    PLUGIN: {
      __BACKGROUND_RAW__: '',
    },
    __LAST_TYPE__: ['paragraph', 0],
    __LAST_CONTENT__: {},
    __LAST_POSITION__: null,
  }

  private mutateLastType = (type: ItemType) => {
    const isSameType = this.globals.__LAST_TYPE__[0] === type

    this.globals.__LAST_TYPE__ = isSameType
      ? [type, ++this.globals.__LAST_TYPE__[1]]
      : [type, 1]
  }

  private posUpdateContent = (content: Content) => {
    if (typeof content === 'string') {
      this.globals.__LAST_CONTENT__ = { raw: content, text: {} }
      this.globals.__LAST_POSITION__ = null

      return
    }

    this.globals.__LAST_CONTENT__ = content
    this.globals.__LAST_POSITION__ = content.position || null
  }

  private getType = (content: Content): ItemType => {
    if (typeof content === 'string') return 'paragraph'

    if (content.checkbox) return 'checkbox'
    if (content.list) return 'list'
    if (content.lineBreak) return 'line-break'
    if (content.pageBreak) return 'page-break'
    if (content.svg) return 'svg'
    if (content.table) return 'table'
    if (content.image) return 'image'
    if (content.text) return 'paragraph'

    return 'paragraph'
  }

  /**
   *  A Content Runner
   *
   * @returns Promise<void>
   */
  private pipeline = async () => {
    if (this.options?.cover) {
      if (!this.pdfkit) return

      await resolveCover(this.pdfkit, this.options.cover)
    }

    for (const content of this.contents) {
      await runPluginBackground(this)

      if (!this.pdfkit) return

      this.mutateLastType(this.getType(content))

      await resolveContent(
        this.pdfkit,
        this.def,
        content,
        this.globals,
        this.runOptions
      )

      this.posUpdateContent(content)
    }
  }

  /**
   *  Internal reset variables
   */
  private reset = () => {
    this.emitter = mitt<EmitterType>()
    this.pdfkit = null
    this.options = null

    this.contents = []
    this.def = pdfDefaults()
    this.runOptions = null

    this.fonts = []

    this.globals = {
      __NEW_PAGE__: true,
      PLUGIN: {
        __BACKGROUND_RAW__: '',
      },
      __LAST_TYPE__: ['paragraph', 1],
      __LAST_CONTENT__: {},
      __LAST_POSITION__: null,
    }
  }

  /**
   * Start a new PDFEasy instance.
   *
   * @example
   *
   * ```ts
   * pdfeasy.new({
   *   document: {
   *     margins: {
   *       top: 40,
   *       bottom: 40,
   *       left: 70,
   *       right: 70
   *     }
   *   }
   * })
   * ```
   *
   * @param options - {@link RunnerOptions}
   */
  public new = (options?: RunnerOptions) => {
    this.reset()
    this.options = {
      cover: options?.cover,
      exports: options?.exports,
      advanced: {
        fontsPurge:
          typeof options?.advanced?.fontsPurge === 'boolean'
            ? options?.advanced?.fontsPurge
            : true,
        backgroundPurge:
          typeof options?.advanced?.backgroundPurge === 'boolean'
            ? options?.advanced?.backgroundPurge
            : true,
      },
      document: options?.document,
      plugins: options?.plugins,
    }

    // set buffer option to tracking page callback's
    options?.plugins?.forEach((plugin) => {
      if (plugin.page?.length !== 0 && this.options?.document) {
        this.options.document['bufferPages'] = true
      } else if (plugin.page?.length !== 0)
        if (!this.options) {
          this.options = {
            document: { bufferPages: true },
          }
        } else {
          this.options.document = { bufferPages: true }
        }
    })

    this.pdfkit = new PDFDocumentWithTables(this.options.document)
  }

  /**
   * Push new contents in pdfeasy pipeline.
   *
   * @example Inserting content
   *
   * ```ts
   * pdfeasy.new([
   *    { raw: 'hello', text: { fontSize: 20 }}
   * ])
   * ```
   *
   * @param contents - {@link Content}
   */
  public add = (contents: Content[]) => {
    if (!this.pdfkit) return

    this.contents = [...this.contents, ...contents]
  }

  /**
   * Set a defaults object
   *
   * @param options - {@link PDFEasyDefaults}
   */
  public defaults = (options: PDFEasyDefaults) => {
    this.def = options
  }

  /**
   * Make a PDF
   *
   * WARNING: Use pdfeasy.run() function before called this
   *
   * @example Blob return for some reasons
   * ```ts
   * pdfeasy.run('blob').then((blob: string) => {
   *   const iframe = document.querySelector('#pdf') as HTMLIFrameElement
   *
   *   iframe.src = blob
   * })
   * ```
   *
   * @example Automatic save file option
   * ```ts
   * pdfeasy.run('save').then(() => {
   *   // content here
   * })
   * ```
   *
   * @example Only run
   * ```ts
   * pdfeasy.run('none').then(() => {
   *   // content here
   * })
   * ```
   *
   * @param emit - {@link PDFRunEmitOption}
   */
  public run = (options?: Partial<RunOptions>): Promise<string> => {
    this.runOptions = resolveRunnerOptions(options || {})
    this.globals.__LAST_CONTENT__ = this.contents[0]
    this.globals.__LAST_POSITION__ = null

    this.options?.plugins?.forEach(({ onBefore }) => onBefore && onBefore())

    return new Promise(async (res, rej) => {
      if (!this.pdfkit) {
        this.reset()
        rej(
          'PDFKit not exists. Did you forget to call `new()` function before calling `run()`?'
        )
        return
      }

      if (this.contents.length === 0)
        rej('Are you sure you added the contents before using this command?')

      if (this.fonts.length !== 0) await setExternalFonts(this)

      onPageAdded(this, () => {
        this.globals.__NEW_PAGE__ = true
      })

      if (this.runOptions?.type === 'server') {
        this.pdfkit?.pipe(
          createWriteStream(
            path.resolve(this.runOptions.cwd + this.runOptions.serverPath) +
              `/${this.options?.exports?.name || 'New PDF'}.pdf`
          )
        )

        this.pipeline()
          .then(async () => {
            await runPluginBackground(this)

            this.options?.plugins?.forEach(
              ({ onAfter }) => onAfter && onAfter()
            )

            this.pdfkit?.end()

            pageHandler(this).then(() => {
              res('done')
            })
          })
          .catch(() => {
            rej('Pipeline error.')
          })

        return
      }

      if (this.runOptions?.type === 'client') {
        const stream = this.pdfkit.pipe(blobStream())

        this.pipeline()
          .then(() => {
            pageHandler(this).then(() => {
              this.options?.plugins?.forEach(
                ({ onAfter }) => onAfter && onAfter()
              )

              this.pdfkit?.end()
            })
          })
          .catch((err) => {
            rej(err)
          })

        stream.on('finish', (): void => {
          switch (this.runOptions?.clientEmit) {
            case 'blob':
              res(stream.toBlobURL('application/pdf'))
              break
            case 'save':
              saveAs(
                stream.toBlob('application/pdf'),
                `/${this.options?.exports?.name || 'New PDF'}.pdf`
              )

              res('done')
              break
            case 'open-link':
              const url = stream.toBlobURL('application/pdf')

              window.open(url, '_blank', 'noopener,noreferrer')

              res('done')
              break
            case 'none':
              res('done')
              break
            default:
              rej('Client emit is wrong!')
          }
        })
      }
    })
  }

  /**
   * Push inject fonts
   *
   * WARNING: Use pdfeasy.addIcons for font icons.
   *
   * @example HTTP (not support in server at moment.)
   *
   * ```ts
   *name: 'Roboto',
   *  normal:
   *  'https://path/to/Roboto-Regular.ttf',
   *  bold: 'https://path/to/Roboto-Medium.ttf',
   *  italic:
   *  'https://path/to/Roboto-Italic.ttf',
   *  bolditalic:
   *  'https://path/to/Roboto-MediumItalic.ttf',
   *},
   *  ])
   * ```
   *
   * @example Local example
   *
   * ```ts
   *name: 'Roboto',
   *  normal:
   *  'fonts/Roboto-Regular.ttf',
   *  bold: 'fonts/Roboto-Medium.ttf',
   *  italic:
   *  'fonts/Roboto-Italic.ttf',
   *  bolditalic:
   *  'fonts/Roboto-MediumItalic.ttf',
   *  },
   *  ])
   *```
   *
   * @param fonts - {@link ExternalFont}
   */
  public addFonts = (fonts: ExternalFont[]) => {
    this.fonts.push(...fonts)
  }
}
