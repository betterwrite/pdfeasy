import { PDFEasyDefaults } from 'src/types'

export const pdfDefaults = (): PDFEasyDefaults => {
  return {
    text: {
      fontSize: 16,
      font: 'Times-Roman',
      color: 'black',
      indent: 0,
      align: 'justify',
      paragraphMargin: 0,
      lineHeight: 0,
      opacity: 1,
      destination: undefined,
      go: undefined,
      bold: false,
      italic: false,
    },
    lineBreak: {
      spacing: 5,
    },
    pageBreak: {
      pages: 1,
    },
  }
}

export const regex = () => {
  const http = (str?: string): any => {
    const r = new RegExp(/https?:\/\//g)

    if (!str) return r

    return str.match(r)
  }

  const base64 = (str?: string): any => {
    const r = new RegExp(
      /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?$/
    )

    if (!str) return r

    return str.match(r)
  }

  const hex = (str: string) => {
    return str.match(new RegExp(/^#(?:[0-9a-fA-F]{3}){1,2}$/))
  }

  return { http, base64, hex }
}

export const pageSizes = () => {
  return {
    '4A0': [4767.87, 6740.79],
    '2A0': [3370.39, 4767.87],
    A0: [2383.94, 3370.39],
    A1: [1683.78, 2383.94],
    A2: [1190.55, 1683.78],
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    A6: [297.64, 419.53],
    A7: [209.76, 297.64],
    A8: [147.4, 209.76],
    A9: [104.88, 147.4],
    A10: [73.7, 104.88],
    B0: [2834.65, 4008.19],
    B1: [2004.09, 2834.65],
    B2: [1417.32, 2004.09],
    B3: [1000.63, 1417.32],
    B4: [708.66, 1000.63],
    B5: [498.9, 708.66],
    B6: [354.33, 498.9],
    B7: [249.45, 354.33],
    B8: [175.75, 249.45],
    B9: [124.72, 175.75],
    B10: [87.87, 124.72],
    C0: [2599.37, 3676.54],
    C1: [1836.85, 2599.37],
    C2: [1298.27, 1836.85],
    C3: [918.43, 1298.27],
    C4: [649.13, 918.43],
    C5: [459.21, 649.13],
    C6: [323.15, 459.21],
    C7: [229.61, 323.15],
    C8: [161.57, 229.61],
    C9: [113.39, 161.57],
    C10: [79.37, 113.39],
    RA0: [2437.8, 3458.27],
    RA1: [1729.13, 2437.8],
    RA2: [1218.9, 1729.13],
    RA3: [864.57, 1218.9],
    RA4: [609.45, 864.57],
    SRA0: [2551.18, 3628.35],
    SRA1: [1814.17, 2551.18],
    SRA2: [1275.59, 1814.17],
    SRA3: [907.09, 1275.59],
    SRA4: [637.8, 907.09],
    EXECUTIVE: [521.86, 756.0],
    FOLIO: [612.0, 936.0],
    LEGAL: [612.0, 1008.0],
    LETTER: [612.0, 792.0],
    TABLOID: [792.0, 1224.0],
  }
}
