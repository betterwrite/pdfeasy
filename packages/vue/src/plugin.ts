import { App, Plugin } from 'vue-demi';
import pdfeasy from 'pdfeasy'

interface PluginOptions {}

export const PDFPlugin: Plugin = {
  install: (app: App, options: PluginOptions = {}) => {
    app.config.globalProperties.$pdf = pdfeasy;
  },
};

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $pdf: typeof pdfeasy;
  }
}