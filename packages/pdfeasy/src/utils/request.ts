import { $fetch } from 'ohmyfetch'

export const getBase64ByURL = (
  data: string,
  response: any = 'blob'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // TODO: full response's support
    $fetch(data)
      .then((res) => {
        if (response === 'arraybuffer') {
          resolve(res.arrayBuffer())
          return
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getDataUri = (url: string): Promise<string> => {
  return new Promise((res, rej) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight

      canvas.getContext('2d')?.drawImage(image, 0, 0)

      res(canvas.toDataURL('image/png'))
    }

    image.onerror = () => {
      rej()
    }

    image.src = url
  })
}
