import { setBackground } from '../pipe/setter'
import pdfeasy from '../runner/pdfeasy'

export const runPluginBackground = async (instance: pdfeasy) => {
  if (instance.options?.plugins) {
    for (const plugin of instance.options.plugins) {
      if (plugin.background && instance.globals.__NEW_PAGE__) {
        // @ts-ignore
        const res = plugin.background(instance.pdfkit.page)

        if (res) await setBackground(instance, res)
      }
    }
  }

  instance.globals.__NEW_PAGE__ = false
}
