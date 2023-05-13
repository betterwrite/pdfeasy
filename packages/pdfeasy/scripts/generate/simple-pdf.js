import pdfeasy from '../../dist/node.esm.js'
import path from 'path'
import process from 'process'

pdfeasy.new({
  exports: {
    name: 'simple',
  },
})

pdfeasy.add([{ raw: 'A simple pdf!', text: {} }])

pdfeasy
  .run({
    type: 'server',
    serverPath: path.resolve(process.cwd() + '/examples'),
  })
  .then(() => {
    console.log('simple-pdf.js ready!')
  })
  .catch(() => {
    console.error('error :(')
  })
