const fs = require('fs')
const path = require('path')

const nodeModules = new RegExp(/^(?:.*[\\\/])?node_modules(?:[\\\/].*)?$/)

module.exports = {
  name: 'dirname',
  setup(build) {
    build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
      if (!filePath.match(nodeModules)) {
        let contents = fs.readFileSync(filePath, 'utf8')
        const loader = path.extname(filePath).substring(1)
        const dirname = path.dirname(filePath)
        contents = contents
          .replace('__dirname', `"${dirname}"`)
          .replace('__filename', `"${filePath}"`)
        return {
          contents,
          loader,
        }
      }
    })
  },
}
