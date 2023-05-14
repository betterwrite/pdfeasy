import pdfeasy from '../../dist/node.esm.js'

pdfeasy.new({
  exports: {
    name: 'simple',
  },
})

pdfeasy.add([{ raw: 'A simple pdf!', text: {} }])

pdfeasy
  .run({
    type: 'server',
    serverPath: '/examples',
  })
  .then(() => {
    console.log('simple-pdf.js ready!')
  })
  .catch(() => {
    console.error('error :(')
  })
