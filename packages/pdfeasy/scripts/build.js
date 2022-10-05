const { dtsPlugin } = require('esbuild-plugin-d.ts')
const { build } = require('esbuild')
const alias = require('esbuild-plugin-alias')
const replace = require('esbuild-plugin-resolve')

const browserPlugin = require('node-stdlib-browser/helpers/esbuild/plugin')
const stdlib = require('node-stdlib-browser')

const importPath = require('./esbuild-import-path')
const correctSet = require('./esbuild-correct-set')
const vendorSourceMap = require('./esbuild-vendor-sourcemap')

const client = () => {
  const make = async (format) => {
    await build({
      platform: 'browser',
      target: ['es2020'],
      color: true,
      logLevel: 'info',
      format,
      entryPoints: ['./src/index.ts'],
      outfile: `./dist/client.${format}.js`,
      bundle: true,
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV === 'production',
      pure: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
      inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
      define: {
        global: 'global',
        process: 'process',
        Buffer: 'Buffer',
      },
      plugins: [
        dtsPlugin(),
        alias({
          // TODO: not use standalone version in future __dirname esbuild support
          pdfkit: require.resolve('pdfkit/js/pdfkit.standalone.js'),
          fontkit: require.resolve('fontkit-next'),
        }),
        replace({
          // See https://stackoverflow.com/questions/55128930/fs-readfile-or-fs-readfilesync-not-a-function-exception-but-why?noredirect=1&lq=1
          "var fs = require('fs');": "import fs from 'fs';",
        }),
        browserPlugin(stdlib),
        importPath,
        correctSet,
        vendorSourceMap,
      ],
      external: ['fontkit-next'],
    })
  }

  make('esm')
  make('cjs')
}

const node = () => {
  const make = async (format) => {
    await build({
      platform: 'node',
      format,
      target: format === 'esm' ? ['es2020', 'node14'] : ['node14'],
      color: true,
      logLevel: 'info',
      entryPoints: ['./src/index.ts'],
      outfile: `./dist/node.${format}.js`,
      bundle: true,
      sourcemap: process.env.NODE_ENV === 'production',
      minify: process.env.NODE_ENV === 'production',
      plugins: [
        replace({
          // See https://github.com/Pzixel/PDFKit-example/pull/1/files
          "var fs = _interopDefault(require('fs'));": "var fs = require('fs');",
        }),
        alias({
          fontkit: require.resolve('fontkit-next'),
        }),
        dtsPlugin(),
        importPath,
        correctSet,
        vendorSourceMap,
      ],
      external: ['fontkit-next', 'pdfkit'], // TODO: Remove external pdfkit
    })
  }

  make('esm')
  make('cjs')
  make('iife')
}

client()
node()
