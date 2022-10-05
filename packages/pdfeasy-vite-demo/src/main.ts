import pdfeasy, { Utils } from 'pdfeasy'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <iframe id="pdf">
`

pdfeasy.new({
  document: {
    margins: {
      top: 40,
      bottom: 40,
      left: 80,
      right: 80
    }
  },
})

pdfeasy.add([
  { raw: 'Hello PDFEasy!', text: { font: 'Roboto' }}, // custom font,
  { stack: [ // stack for paragraph's
    { raw: 'A ', text: {}},
    { raw: 'Simple', text: { bold: true, italic: true }},
    { raw: ' Stack!', text: {}},
  ]},
  // svg
  { raw: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><circle cx="25" cy="25" r="20"/></svg>', svg: {}},
  // png (link or base64)
  // { raw: 'https://i.imgur.com/image.png', image: {} },
  ...Utils.content(), // Utils for debug
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