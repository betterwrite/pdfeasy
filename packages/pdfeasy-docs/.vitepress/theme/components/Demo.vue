<script setup>
  import pdfeasy, { Utils } from 'pdfeasy'
  import { onMounted, ref, watch } from 'vue'

  const code =
    ref(`{ raw: '${Utils.loremIpsum().title()}', text: { fontSize: 28, bold: true, lineHeight: 5 } },
{ raw: '${Utils.loremIpsum().paragraph()}' }`)
  const __RENDERING__ = ref(false)

  const textarea = ref(null)
  const iframe = ref(null)

  const onCompile = async () => {
    let parse

    try {
      parse = await eval('[' + code.value + ']')
    } catch (e) {}

    if (!parse) return

    __RENDERING__.value = true

    pdfeasy.new({
      plugins: [],
    })

    await pdfeasy.add(parse)

    console.log('here?')

    pdfeasy
      .run({
        client: {
          emit: 'blob',
        },
      })
      .then((blob) => {
        console.log('here?')
        iframe.value.src = blob
      })
      .catch((res) => {
        console.error(res)
      })
      .finally(() => {
        __RENDERING__.value = false
      })
  }

  watch(code, (_code) => {
    if (!__RENDERING__.value) onCompile()
  })

  onMounted(() => {
    onCompile()
  })
</script>

<template>
  <div class="flex w-full justify-center items-center p-10">
    <main
      class="flex flex-col w-full h-96 rounded shadow-gray-900 shadow bg-gray-900 text-gray-300"
    >
      <section
        class="flex flex-grow flex-col rounded md:flex-row overflow-hidden"
      >
        <textarea
          spellcheck="false"
          ref="textarea"
          v-model="code"
          class="flex-grow resize-none p-5 text-sm tracking-wide text-left bg-gray-900 w-full md:w-1/2 shadow-sm shadow-black"
        />
        <iframe
          ref="iframe"
          class="flex-grow bg-gray-900 w-full md:w-1/2 shadow-sm shadow-black"
        />
      </section>
    </main>
  </div>
</template>
