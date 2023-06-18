import pdfeasy from '../../dist/node.esm.js'

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
    type: 'server',
    serverPath: '/examples',
  })
  .then(() => {
    console.log('using-external-font-pdf.js ready!')
  })
  .catch(() => {
    console.error('error :(')
  })
