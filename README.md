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
  <a><img src="https://img.shields.io/github/license/Novout/pdfeasy?style=for-the-badge&color=5cb4f8&label="></a>
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

### NPM

```shell
npm i pdfeasy
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
  }
})

pdfeasy.add([
  { raw: 'Simple text!' },
])

pdfeasy.run({
  type: 'client',
  clientEmit: 'blob'
}).then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
}).catch((err: any) => {
  console.error(err)
})
```

## Content

```ts
pdfeasy.add([
  ...Utils.content(), // Utils for debug
  { raw: 'Hello PDFEasy!', text: { font: 'Roboto' }}, // text with custom font,
  { raw: 'https://i.imgur.com/path.png', image: {}}, // external image
  { stack: [ // stack for paragraph's
    { raw: 'A ', text: {}},
    { raw: 'Simple', text: { bold: true, italic: true }},
    { raw: ' Stack!', text: {}},
  ]},
])
```

## Plugins

```ts
pdfeasy.new({
  plugins: [{
    cover: 'https://i.imgur.com/path.png', // cover image (it's ignore default explicit margins insert)
    background: (page) => { // render custom background in pages
      return 'https://i.imgur.com/path.png'
    },
    onBefore: () => {
      // before contents transform
    },
    onAfter: () => {
      // after contents transform
    },
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
          // negative number (-20 in case) ignore default pdfkit margins
          y: context.margins.top - 20
        })
      }
    ]
  }]
})
```

> Plugins runs as a queue.

## Runner Options

```ts
pdfeasy.run({
  type: 'client',
  clientEmit: 'save'
}).then(() => {}).catch((err: any) => {
  console.error(err)
})
```

```ts
pdfeasy.run({
  type: 'server',
  serverPath: path.resolve(process.cwd() + '/examples')
}).then(() => {}).catch((err: any) => {
  console.error(err)
})
```

## Custom Fonts

```ts
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
```

> **Attention!** Client-Side version not support relative/absolute font paths at this time.

## Resources

See [source demo](./demo) for more explanations

See [examples](./examples/) for .pdf results.

See [scripts](./scripts/generate/) for server-side runner.

## Bundles

> **Attention!** Its recommended use explicit imports (*import pdfeasy from 'pdfeasy/dist/client.esm.js'*) in your projects.

`pdfeasy/dist/client.cjs.js`

`pdfeasy/dist/client.esm.js`

`pdfeasy/dist/node.cjs.js`

`pdfeasy/dist/node.esm.js`

`pdfeasy/dist/node.iife.js`
