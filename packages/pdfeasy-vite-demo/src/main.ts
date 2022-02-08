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
  plugins: [
    {
      page: [ // render callback in every page before finish contents insert.
        // simple counter footer
        ({ Text, Image }, context, current, total) => {
          // render in every page
          Text(`${current}/${total}`, { fontSize: 20 }, {
            x: context.width / 2,
            y: context.height - context.margins.bottom
          })

          // Image('https://i.imgur.com/J3JXhsl.png', {}, {})
        },
        // simple header
        ({ Text }, context, current, total) => {
          // render in every page
          Text('A Simple Header', {}, {
            x: context.width / 2,
            // negative number (-30 in case) ignore default margins
            y: context.margins.top - 20
          })
        }
      ]
    }
  ]
})

pdfeasy.add([
  ...Utils.content(), // Utils for debug
  { raw: 'Hello PDFEasy!', text: { font: 'Roboto' }}, // custom font,
  { raw: 'https://i.imgur.com/GbmBw3N.png', image: {}}, // external image
  { stack: [ // stack for paragraph's
    { raw: 'A ', text: {}},
    { raw: 'Simple', text: { bold: true, italic: true }},
    { raw: ' Stack!', text: {}},
  ]},
  // not recommended use this
  { raw: 'Text without option!' },
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

pdfeasy.run({
  client: {
    emit: 'blob'
  }
}).then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
  iframe.style.height = '80vh'
  iframe.style.width = '50%'
}).catch((err: any) => {
  console.error(err)
})