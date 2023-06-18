import pdfeasy from 'pdfeasy'
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
  { raw: 'A simple pdf', text: { font: 'Roboto' }},
  { lineBreak: {} },
  { raw: 'using...', text: { position: { x: 250, y: 0 }} },
  { raw: 'hm...', text: {} },
  { pageBreak: {} },
  { raw: 'pdfeasy!', text: {} },
  { raw: 'a first in list...', list: { style: 'counter' } },
  { raw: 'a second in list...', list: { style: 'counter' } },
  { raw: 'a third in list...', list: { style: 'counter' } },
  { raw: 'a list with circle...', list: { style: 'circle' } },
  { raw: 'test', qrcode: {} },
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