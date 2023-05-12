const fs = require('fs')

module.exports = {
  name: 'vendor-sourcemap',
  setup(build) {
    build.onLoad({ filter: /node_modules/ }, (args) => {
      if (args.path.endsWith('.js')) {
        return {
          contents:
            fs.readFileSync(args.path, 'utf8') +
            '\n//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiJdLCJtYXBwaW5ncyI6IkEifQ==',
          loader: 'default',
        }
      }
    })
  },
}
