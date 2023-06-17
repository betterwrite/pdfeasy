import { getImageRaw } from '../content/image'
import { regex } from '../utils/defines'
import { PDFEasy } from '../runner/pdfeasy'

export const setBackground = async (instance: PDFEasy, str: string) => {
  if (!instance.pdfkit) return

  const kit = instance.pdfkit

  if (regex().hex(str)) {
    kit.rect(0, 0, kit.page.width, kit.page.height).fill(str)

    return
  }

  const backgroundPurge = instance.options?.advanced?.backgroundPurge
  const globalRaw = instance.globals.PLUGIN.__BACKGROUND_RAW__

  const { raw, type } = await getImageRaw(
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
