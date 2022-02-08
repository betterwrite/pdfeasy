module.exports = {
  name: 'import-path',
  setup(build) {
    build.onResolve({ filter: /^\.\/virtualfs-browser$/ }, (args) => {
      return { path: args.path, external: true }
    })
  },
}
