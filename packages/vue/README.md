# Vue PDFMake

A PDFEasy plugin for Vue 3.x

## Install

`npm i vue-pdfeasy`

## Example

```ts
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