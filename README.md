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
- **✅ Write in Typescript and Builded with [ESBuild](https://github.com/evanw/esbuild)**
- **✅ Browser STDLib**
- **✅ Custom Fonts && Purge Unused Fonts**
- **✅ [Nuxt](./packages/nuxt) & [Vue](./packages/vue) Support**
- **✅ Plugins Ready!**

## Setup

```shell
npm i pdfeasy
```

```ts
import pdfeasy from 'pdfeasy'

pdfeasy.new()

pdfeasy.add([
  { raw: 'PDFEasy!' },
])

pdfeasy.run({
  type: 'client',
  clientEmit: 'blob'
}).then((blob: string) => {
  const iframe = document.querySelector('#pdf') as HTMLIFrameElement

  iframe.src = blob
}).catch((err) => {
  // ...
})
```

### [Vue](./packages/vue)

```shell
npm i vue-pdfeasy
```

```ts
import { PDFPlugin } from 'vue-pdfeasy';

const app = createApp(App);
app.use(PDFPlugin);
app.mount('#app');

// ...

<script setup>
import { usePDF } from 'vue-pdfeasy';

const pdf = usePDF()

// ...
</script>
```

### [Nuxt](./packages/nuxt)

```bash
npm i nuxt-pdfeasy
```

```js
// nuxt.config.ts
modules: [
  'nuxt-pdfeasy'
]
```

```ts
<script setup>
import { useNuxtApp } from '#app';

const { $pdf } = useNuxtApp()
// ...
</script>
```

## Content

```ts
pdfeasy.add([
  ...Utils.content(), // Utils for debug
  { raw: 'Hello PDFEasy!', text: { font: 'Roboto' } }, // text with custom font,
  { raw: 'https://i.imgur.com/path.png', image: {} }, // external image
  { stack: [ // stack for paragraph's
    { raw: 'A ', text: {} },
    { raw: 'Simple', text: { bold: true, italic: true } },
    { raw: ' Stack!', text: {} },
  ]},
  { pageBreak: {} }, // page break
  { lineBreak: {} }, // line break
  { raw: 'A checkbox!', checkbox: {} }, // checkbox
  { raw: 'A list!', list: { style: 'circle' } }, // list
  { table: { // table. Check pdfkit-table package for more explanations
    body: {
      title: "Title",
      subtitle: "subtitle",
      headers: [ "Item 1", "Item 2" ],
      rows: [
        [ "A", "100%" ],
        [ "B", "50%" ],
      ],
    },
    options: {}
  }},
  { form: [ // dynamic forms
    { name: 'button-field', type: 'button', options: { label: 'Click here!'} },
    { name: 'text-field', type: 'text', options: { value: '' }},
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

### Client-Side Setup

```ts
pdfeasy.run({
  type: 'client',
  clientEmit: 'save',
}).then(() => {}).catch((err) => {
  console.error(err)
})
```

### Server-Side Setup

```ts
pdfeasy.run({
  type: 'server',
  serverPath: '/examples',
}).then(() => {}).catch((err) => {
  console.error(err)
})
```

### Color Schema

It is possible to define the color scheme used automatically:

```ts
// converts all hex color to cmyk
pdfeasy.run({ colorSchema: 'CMYK' })

// preserve hex colors (it's default)
pdfeasy.run({ colorSchema: 'RBG' })
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

See [examples](./packages/pdfeasy/examples/) for .pdf results.

See [scripts](./packages/pdfeasy/scripts/generate/) for server-side runner.

## Bundles

`pdfeasy/dist/client.cjs.js`

`pdfeasy/dist/client.esm.js`

`pdfeasy/dist/node.cjs.js`

`pdfeasy/dist/node.esm.js`
