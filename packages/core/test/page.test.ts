import { describe, expect, it } from "vitest"
import pdfeasy from "../src/index";

describe('Page - Text', () => {
  it('should run a simple footer and header callback', () => {
    pdfeasy.new({
      plugins: [
        {
          page: [
            ({ Text }, context, current, total) => {
              Text(`${current}/${total}`, {}, {
                x: context.width / 2,
                y: context.height - context.margins.bottom
              })
            },
            ({ Text }, context, current, total) => {
              Text('A Simple Header', {}, {
                x: context.width / 2,
                y: context.margins.top - 20
              })
            }
          ]
        }
      ]
    })

    pdfeasy.add([
      { raw: 'XPTO', text: {} }
    ])
    
    return expect(pdfeasy.run({
      clientEmit: 'none'
    })).resolves.toBeTruthy()
  })
})