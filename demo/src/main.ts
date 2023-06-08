import { PDFEasy, Utils } from 'pdfeasy'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <iframe id="pdf">
`

const pdfeasy = new PDFEasy()

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
  { raw: 'a first in list...', list: { style: 'counter' } },
  { raw: 'a second in list...', list: { style: 'counter' } },
  { raw: 'a third in list...', list: { style: 'counter' } },
  ...Utils.content(),
  ...Utils.content(),
  { raw: 'a list with circle...', list: { style: 'circle' } },
  { table: {
    body: {
      title: "Countries",
      subtitle: "A countries list of conversion rate",
      headers: [ "Country", "Conversion rate", "Trend" ],
      rows: [
        [ "Switzerland", "12%", "+1.12%" ],
        [ "France", "67%", "-0.98%" ],
        [ "England", "33%", "+4.44%" ],
      ],
    }
  }},
  { form: [
    { name: 'button-field', type: 'button', options: { label: 'Click here!'} }
  ]},
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