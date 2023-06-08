import { App, Plugin } from 'vue-demi';
import pdfeasy from 'pdfeasy'

interface PluginOptions {}

export const PDFPlugin: Plugin = {
  install: (app: App, options: PluginOptions = {}) => {
    // @ts-expect-error
    app.config.globalProperties.$pdf = pdfeasy.default;
  },
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $pdf: typeof pdfeasy;
  }
}