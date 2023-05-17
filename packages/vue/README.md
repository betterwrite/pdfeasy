# Vue PDFEasy

A PDFEasy plugin for Vue 3.x

## Install

`npm i vue-pdfeasy`

## Example

```ts
//...
import { PDFPlugin } from 'vue-pdfeasy';
//...
const app = createApp(App);
app.use(PDFPlugin);
app.mount('#app');

// ...

<template>
  <iframe id="pdf" />
</template>

<script setup lang="ts">
import { usePDF } from 'vue-pdfeasy'

const pdf = usePDF()

pdf.new()

pdf.add([
  { raw: 'Simple text!' },
])

pdf.run({
  type: 'client',
  clientEmit: 'blob'
}).then((blob) => {
  const iframe = document.querySelector('#pdf')

  iframe.src = blob
}).catch((err) => {
  console.error(err)
})
</script>
```

- **For PDFEasy docs, [click here](https://github.com/betterwrite/pdfeasy)**