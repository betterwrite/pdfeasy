import { HexColor } from 'src/types'

export const HEXToCMYK = (
  color: HexColor
): [number, number, number, number] | HexColor => {
  let C = 0
  let M = 0
  let Y = 0
  let K = 0

  const hex = color.charAt(0) == '#' ? color.substring(1, 7) : color

  if (hex.length != 6) {
    return color
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  if (r === 0 && g === 0 && b === 0) {
    return [0, 0, 0, 100]
  }

  C = 1 - r / 255
  M = 1 - g / 255
  Y = 1 - b / 255

  const minCMY = Math.min(C, Math.min(M, Y))

  C = (C - minCMY) / (1 - minCMY)
  M = (M - minCMY) / (1 - minCMY)
  Y = (Y - minCMY) / (1 - minCMY)
  K = minCMY

  C = Math.round(C * 100)
  M = Math.round(M * 100)
  Y = Math.round(Y * 100)
  K = Math.round(K * 100)

  C = Number(C.toFixed(0)) ?? 0
  M = Number(M.toFixed(0)) ?? 0
  Y = Number(Y.toFixed(0)) ?? 0
  K = Number(K.toFixed(0)) ?? 0

  return [C, M, Y, K]
}
