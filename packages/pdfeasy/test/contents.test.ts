import { describe, expect, it } from "vitest";
import pdfeasy from "../src/index";

describe('Contents - text', () => {
  it('should run simple text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO', text: {} }
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })

  it('should run simple text without text object', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO' }
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })

  it('should run multiple text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO Title', text: {} },
      { raw: 'XPTO', text: {} },
      { raw: 'XPTO', text: {} },
      { raw: 'XPTO', text: {} }
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })

  it('should run multiple types text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO Title', text: {} },
      { raw: 'XPTO', text: { italic: true } },
      { raw: 'XPTO', text: { bold: true } },
      { raw: 'XPTO', text: { italic: true, bold: true } },
      { raw: 'XPTO', text: {} }
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })

  it('should run multiple fonts text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'XPTO Title', text: { font: 'Helvetica' } },
      { raw: 'XPTO', text: { font: 'Times-Roman', bold: true, italic: true } },
      { raw: 'XPTO', text: { font: 'Courier', bold: true } },
      { raw: 'XPTO', text: { font: 'Courier', italic: true, bold: true } },
      { raw: 'XPTO', text: { font: 'Helvetica'} },
      { raw: 'XPTO', text: { font: 'Helvetica', italic: true } },
      { raw: 'XPTO', text: { font: 'Times-Roman', bold: true } },
      { raw: 'XPTO', text: { font: 'Times-Roman', italic: true } },
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })
})

describe('Contents - stack', () => {
  it('should create multiple stacks', () => {
    pdfeasy.new()

    pdfeasy.add([
      { stack: [ { raw: 'XPTO', text: {}}]},
      { raw: 'XPTO', text: {}},
      { stack: [ { raw: 'XPTO', text: {}}]}
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })
})

describe('Contents - image', () => {
  it('should render base64 png', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', image: {} },
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })

  it('should render base64 png with custom options', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', image: { size: { width: 200, height: 200, scale: 0.} } },
    ])

    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })
})