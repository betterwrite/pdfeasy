import fs from 'fs';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import client, { Utils as ClientUtils } from '../dist/client.esm'
import server, { Utils as ServerUtils } from '../dist/node.esm'

describe("PDFEasy Bundle - Client", () => {
  it("should pdfeasy exists", () => {
    // for validade polyfills and global settings
    expect(client).toBeTruthy()
  });

  it("should execute common flow", () => {
    client.new()

    client.add([
      { raw: ClientUtils.loremIpsum().paragraph(), text: {} }
    ])

    return expect(client.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })

  it("should not execute common flow in empty contents", () => {
    client.new()

    client.add([])

    expect(client.contents.length).toBe(0)

    return expect(client.run({
      client: {
        emit: 'none'
      }
    })).rejects.toBeTruthy()
  })
});

describe("PDFEasy Bundle - Server", () => {
  // TODO: vitest future mock-fs support for not write pdf in local development
  beforeEach(() => {
    vi.spyOn(fs, 'writeFile').mockImplementation((a: any, b: any) => {});
    vi.spyOn(fs, 'writeFileSync').mockImplementation((a: any, b: any) => {});
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should pdfeasy exists", () => {
    // for validade global settings
    expect(server).toBeTruthy()
  });

  it("should execute common flow", () => {
    server.new({
      document: {
        displayTitle: true
      }
    })

    server.add([
      { raw: ServerUtils.loremIpsum().paragraph(), text: {} }
    ])

    return expect(server.run({ server: {
      path: '/'
    }})).resolves.toBeTruthy()
  })

  it("should not execute common flow in empty contents", () => {
    server.new()

    server.add([])

    expect(server.contents.length).toBe(0)

    return expect(server.run({ server: {
      path: '/'
    }})).rejects.toBeTruthy()
  })
});