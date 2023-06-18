import { describe, expect, it } from "vitest";
import pdfeasy from "../src/index";

describe('Fonts - fontsPurge option', () => {
  it('should not inject fonts', async () => {
    pdfeasy.new({
      advanced: {
        fontsPurge: true
      }
    })

    pdfeasy.add([
      { raw: 'XPTO', text: {} }
    ])

    await pdfeasy.run({
      clientEmit: 'none'
    })

    expect(pdfeasy.fonts.length).toBe(0)
  })

  it('should not inject fonts in stack', async () => {
    pdfeasy.new({
      advanced: {
        fontsPurge: true
      }
    })

    pdfeasy.add([{ raw: 'XPTO' }])

    await pdfeasy.run({
      clientEmit: 'none'
    })

    expect(pdfeasy.fonts.length).toBe(0)
  })

  it('should not use inject font', async () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO', text: {} }
    ])

    pdfeasy.addFonts([
      {
        name: 'Roboto',
        normal:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        bold: 'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        italic:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        bolditalic:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
      },
    ])

    await pdfeasy.run({
      clientEmit: 'none'
    })

    expect(pdfeasy.fonts.length).toBe(0)
  })
})

describe('Fonts - Register', () => {
  it('should use url fonts', async () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO', text: { font: 'Roboto' } }
    ])

    pdfeasy.addFonts([
      {
        name: 'Roboto',
        normal:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        bold: 'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        italic:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
        bolditalic:
          'https://fonts.gstatic.com/s/roboto/v19/KFOmCnqEu92Fr1Mu4mxPKTU1Kg.ttf',
      },
    ])

    await pdfeasy.run({
      clientEmit: 'none'
    })

    expect(pdfeasy.fonts.length).toBe(1)
  })
})