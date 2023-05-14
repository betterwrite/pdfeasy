import pdfeasy, { Utils } from 'pdfeasy'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <iframe id="pdf">
`

pdfeasy.new({
  document: {
    margins: {
      top: 80,
      bottom: 80,
      left: 80,
      right: 80
    }
  },
})

pdfeasy.add([
  { raw: 'A simple pdf', text: {} },
  { lineBreak: {} },
  { raw: 'using...', text: {} },
  { pageBreak: {} },
  { raw: 'pdfeasy!', text: {} },
  ...Utils.content(),
  ...Utils.content(),
  ...Utils.content(),
  { raw: 'a checkbox...', checkbox: {} },
  { raw: 'a first in list...', list: { style: 'counter' } },
  { raw: 'a second in list...', list: { style: 'counter' } },
  { raw: 'a third in list...', list: { style: 'counter' } },
  ...Utils.content(),
  ...Utils.content(),
  { raw: 'a list with circle...', list: { style: 'circle' } },
])

// or https://path/to/Roboto.ttf
pdfeasy.addFonts([
  {
    name: 'Roboto',
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italic: 'fonts/Roboto-Italic.ttf',
    bolditalic: 'fonts/Roboto-BoldItalic.ttf'
  }
])

pdfeasy.run({ colorSchema: 'CMYK' }).then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
  iframe.style.height = '80vh'
  iframe.style.width = '50%'
}).catch((err: any) => {
  console.error(err)
})