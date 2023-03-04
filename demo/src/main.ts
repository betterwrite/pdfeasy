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

pdfeasy.run().then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
  iframe.style.height = '80vh'
  iframe.style.width = '50%'
}).catch((err: any) => {
  console.error(err)
})