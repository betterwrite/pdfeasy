import pdfeasy from '../runner/pdfeasy'

export const onPageAdded = (instance: pdfeasy, cb: any) => {
  instance.pdfkit?.on('pageAdded', () => {
    cb && cb()
  })
}
