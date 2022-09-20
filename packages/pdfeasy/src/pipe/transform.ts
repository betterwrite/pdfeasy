import { Fonts } from '../utils/types'
import { ContentText } from './factory'

export const getCorrectFontFamily = (
  font: Fonts,
  options: ContentText
): Fonts => {
  if (font === 'Symbol' || font === 'ZapfDingbats') return font

  if (options.italic && options.bold) {
    if (font === 'Times-Roman') return 'Times-BoldItalic'

    return (font + '-BoldOblique') as Fonts
  }

  if (options.italic) {
    if (font === 'Times-Roman') return 'Times-Italic'

    return (font + '-Oblique') as Fonts
  }

  if (options.bold) {
    if (font === 'Times-Roman') return 'Times-Bold'

    return (font + '-Bold') as Fonts
  }

  return font
}
