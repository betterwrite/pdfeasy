import { App, Plugin } from 'vue-demi';
import { PDFEasy } from 'pdfeasy'

interface PluginOptions {}

export const PDFPlugin: Plugin = {
  install: (app: App, options: PluginOptions = {}) => {
    app.config.globalProperties.$pdf = new PDFEasy();
  },
};

declare module "vue" {
  interface ComponentCustomProperties {
    $pdf: PDFEasy;
  }
}