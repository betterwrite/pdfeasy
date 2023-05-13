import { ImageRaw } from 'src/types'
import { regex } from '../utils/defines'
import { getDataUri } from '../utils/request'

export const SvgToPNG = (raw: string): Promise<{ raw: string }> => {
  return new Promise((res, rej) => {
    const set = !raw.includes('<svg xmlns="http://www.w3.org/2000/svg"')
      ? raw.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg"')
      : raw
    // convert svg to png
    const blob = new Blob([set], {
      type: 'image/svg+xml;charset=utf-8',
    })

    const URL = window.URL || window.webkitURL || window

    const blobURL = URL.createObjectURL(blob)

    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => {
      const canvas = document.createElement('canvas')

      canvas.width = 2000
      canvas.height = 2000

      const context = canvas.getContext('2d') as CanvasRenderingContext2D

      context.drawImage(image, 0, 0, 2000, 2000)

      const url = canvas.toDataURL('image/png')

      res({ raw: url })
    }
    image.onerror = () => {
      rej()
    }

    // TODO: other blob performatic method
    image.src = blobURL
  })
}

export const getImageRaw = (raw: string): Promise<ImageRaw> => {
  return new Promise(async (res) => {
    if (regex().base64(raw)) {
      res({
        raw,
        type: 'base64',
      })
    }

    if (regex().http(raw)) {
      await getDataUri(raw).then((data: string) => {
        res({
          raw: data,
          type: 'http',
        })
      })
    }

    // TODO: getDataUri type
    res({
      raw,
      type: 'base64',
    })
  })
}
