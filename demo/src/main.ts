import pdfeasy from 'pdfeasy'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <iframe id="pdf">
`

pdfeasy.add([
  { raw: 'A simple pdf', text: { font: 'Roboto' }},
  { lineBreak: {} },
  { raw: 'using...', text: {}, position: { x: 250, y: 0 } },
  { raw: 'hm...' },
  'aaaaa...',
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

pdfeasy.run({ clientEmit: 'open-link' }).then(() => {

}).catch((err: any) => {
  console.error(err)
})