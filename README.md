<p align="center">
  <img src="./.github/logo.png" height="260">
</p>

<h1 align="center">
PDFEasy
</h1>
<h4 align="center">
Client/Server Side PDF-Generator based in PDFKit
<h4>
<br>
<p align="center">
  <a><img src="https://img.shields.io/github/workflow/status/Novout/pdfeasy/Tests?style=for-the-badge&color=5cb4f8&"></a>
  <a><img src="https://img.shields.io/github/license/Novout/pdfeasy?style=for-the-badge&color=5cb4f8&label="></a>
  <a><img src="https://img.shields.io/github/lerna-json/v/Novout/pdfeasy?style=for-the-badge&color=5cb4f8&label="></a>
<p>

<br>
<br>

- **✅ Client/Server Side Support**
- **✅ Write in Typescript**
- **✅ Builded with [ESBuild](https://github.com/evanw/esbuild) and requests with [OhMyFetch](https://github.com/unjs/ohmyfetch)**
- **✅ Browser STDLib**
- **✅ Custom Fonts && Purge Unused Fonts**
- **✅ Plugins Ready!**

## Installation

It's simple!

### NPM

```shell
npm i pdfeasy
```

### YARN

```shell
yarn add pdfeasy
```

### PNPM

```shell
pnpm add pdfeasy
```

## Simple Example

```ts
import pdfeasy, { Utils } from 'pdfeasy'
// import pdfeasy, { Utils } from 'pdfeasy/dist/client.cjs.js'
// import pdfeasy, { Utils } from 'pdfeasy/dist/node.esm.js'
// import pdfeasy, { Utils } from 'pdfeasy/dist/node.cjs.js'

pdfeasy.new({
  document: { // PDFKit options
    margins: {
      top: 40,
      bottom: 40,
      left: 80,
      right: 80
    }
  },
  plugins: [ // Plugins!
    {
      page: [ // render callback in every page AFTER finish contents insert. Not support before at this time.
        // simple counter footer
        ({ Text, Image }, context, current, total) => {
          // render in every page
          Text(`${current}/${total}`, { fontSize: 20 }, {
            x: context.width / 2,
            y: context.height - context.margins.bottom
          })

          // Image('https://i.imgur.com/to/path.png', {}, {})
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
  { raw: 'https://i.imgur.com/path.png', image: {}}, // external image
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

pdfeasy.run().then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
}).catch((err: any) => {
  console.error(err)
})
```

See [source demo](./packages/pdfeasy-vite-demo/) for more explanations

See [examples](./packages/pdfeasy/examples/) for .pdf results.

See [scripts](./packages/pdfeasy/scripts/generate/) for server-side runner.

## Bundles

> Uses standard minification

`pdfeasy/dist/client.cjs.sj`

`pdfeasy/dist/client.esm.sj`

`pdfeasy/dist/node.cjs.sj`

`pdfeasy/dist/node.esm.sj`

`pdfeasy/dist/node.iife.sj`

`pdfeasy/dist/index.d.ts`