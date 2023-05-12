# Nuxt3 PDFEasy Module

- **For PDFEasy docs, [click here](https://github.com/betterwrite/pdfeasy)**

## Setup

```bash
yarn add nuxt-pdfeasy
// OR
npm i nuxt-pdfeasy
```

```js
// nuxt.config.ts
modules: [
  'nuxt-pdfeasy'
]
```

## Example

```ts
<template>
  <iframe id="pdf" />
</template>

<script setup>
import { useNuxtApp } from '#app';

const { $pdf } = useNuxtApp()

$pdf.new({
  plugins: [
    {
      page: [
        // simple counter footer
        ({ Text }, context, current, total) => {
          // render in every page
          Text(`${current}/${total}`, { fontSize: 20 }, {
            x: context.width / 2,
            y: context.height - context.margins.bottom
          })
        },
        // simple header
        ({ Text }, context, current, total) => {
          // render in every page
          Text('A Simple Header', {}, {
            x: context.width / 2,
            y: context.margins.top - 20
          })
        }
      ]
    }
  ]
})

$pdf.add([
  { raw: 'Hello NUXT!', text: { fontSize: 22 }},
])

$pdf.run().then(blob => {
  const iframe = document.querySelector('#pdf')

  iframe.src = blob
}).catch((err) => {
  console.error(err)
})
</script>
```
