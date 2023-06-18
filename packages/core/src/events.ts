import { PDFEasy } from './runner'

export const onPageAdded = (instance: PDFEasy, cb: any) => {
  instance.pdfkit?.on('pageAdded', () => {
    cb && cb()
  })
}
