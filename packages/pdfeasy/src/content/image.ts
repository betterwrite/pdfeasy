import { regex } from 'src/utils/defines'
import { getDataUri } from 'src/utils/request'

export interface ImageRaw {
  raw: string
  type: 'base64' | 'http'
}

export const getImageRaw = (raw: string): Promise<ImageRaw> => {
  return new Promise(async (res, rej) => {
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
