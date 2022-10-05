import { describe, expect, it } from "vitest";
import pdfeasy, { Utils } from "../src/index";

describe('Contents - text', () => {
  it('should run simple text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: Utils.loremIpsum().paragraph(), text: {} }
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it('should run simple text without text object', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: Utils.loremIpsum().paragraph() }
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it('should run multiple text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: Utils.loremIpsum().title(), text: {} },
      { raw: Utils.loremIpsum().paragraph(), text: {} },
      { raw: Utils.loremIpsum().paragraph(), text: {} },
      { raw: Utils.loremIpsum().paragraph(), text: {} }
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it('should run multiple types text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: Utils.loremIpsum().title(), text: {} },
      { raw: Utils.loremIpsum().paragraph(), text: { italic: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { bold: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { italic: true, bold: true } },
      { raw: Utils.loremIpsum().paragraph(), text: {} }
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it('should run multiple fonts text', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: Utils.loremIpsum().title(), text: { font: 'Helvetica' } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Times-Roman', bold: true, italic: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Courier', bold: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Courier', italic: true, bold: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Helvetica'} },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Helvetica', italic: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Times-Roman', bold: true } },
      { raw: Utils.loremIpsum().paragraph(), text: { font: 'Times-Roman', italic: true } },
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })
})

describe('Contents - stack', () => {
  it('should create multiple stacks', () => {
    pdfeasy.new()

    pdfeasy.add([
      { stack: [ { raw: Utils.loremIpsum().paragraph(), text: {}}]},
      { raw: Utils.loremIpsum().paragraph(), text: {}},
      { stack: [ { raw: Utils.loremIpsum().paragraph(), text: {}}]}
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
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
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it('should render base64 png with custom options', () => {
    pdfeasy.new()

    pdfeasy.add([
      { raw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=', image: { size: { width: 200, height: 200, scale: 0.} } },
    ])

    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })
})