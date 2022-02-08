import pdfeasy from '../../dist/node.esm.js'
import path from 'path'
import process from 'process'

pdfeasy.new({
  exports: {
    name: 'using-external-font',
  },
})

pdfeasy.add([{ raw: 'A Roboto simple text!', text: { font: 'Roboto' } }])

pdfeasy.addFonts([
  {
    name: 'Roboto',
    normal:
      'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
    bold: 'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
    italic:
      'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
    bolditalic:
      'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
  },
])

pdfeasy
  .run({
    server: {
      path: path.resolve(process.cwd() + '/examples'),
    },
  })
  .then(() => {
    console.log('using-external-font-pdf.js ready!')
  })
  .catch(() => {
    console.error('error :(')
  })
