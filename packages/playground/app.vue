<template>
  <div class="flex font-raleway flex-col w-full h-screen bg-primary">
    <SeoKit />
    <header class="flex font-poppins text-lg gap-5 justify-between items-center bg-secondary p-2 font-bold text-white w-full">
      <div class="flex gap-2 items-center">
        <img class="w-6" src="/logo.png" />
        <p>PDFEasy Playground</p>
      </div>
      <a target="_blank" class="cursor-pointer" href="https://github.com/betterwrite/pdfeasy">
        <IconGithub class="w-7 h-7 text-white" />
      </a>
    </header>
    <main class="flex flex-col md:flex-row w-full h-screen">
      <MonacoEditor :options="{ theme: 'vs-dark' }" class="flex-1 w-full" v-model="raw" lang="typescript" />
      <iframe class="flex-1 w-full" id="pdf" />
    </main>
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app';
import IconGithub from './icons/IconGithub.vue';

const raw = ref(`$pdf.add([
  { raw: 'Hello PDFEasy!' },
  { stack: [
    { raw: 'A ', text: {} },
    { raw: 'Simple', text: { bold: true, italic: true } },
    { raw: ' Stack!', text: {} },
  ]},
  { pageBreak: {} },
  { lineBreak: {} },
  { raw: 'A checkbox!', checkbox: {} }, 
  { raw: 'A list!', list: { style: 'circle' } },
  { table: {
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
  }}
])`)

onMounted(() => {
  watchDebounced(raw, () => {
    const template = `const { $pdf } = useNuxtApp()
    
$pdf.new()

${raw.value}

$pdf.run({ type: 'client', clientEmit: 'blob' }).then(blob => {
  const iframe = document.querySelector('#pdf')

  iframe.src = blob
}).catch(() => {})`

    try {
      eval(template)
    } catch(e) {}
}, { immediate: true, debounce: 500 })
})
</script>
