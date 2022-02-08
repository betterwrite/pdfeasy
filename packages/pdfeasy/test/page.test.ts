import { describe, expect, it } from "vitest"
import pdfeasy, { Utils } from "../src/index";

describe('Page - Text', () => {
  it('should run a simple footer and header callback', () => {
    pdfeasy.new({
      page: [
        // simple counter footer
        ({ Text }, context, current, total) => {
          // render in every page
          Text(`${current}/${total}`, {}, {
            x: context.width / 2,
            y: context.height - context.margins.bottom
          })
        },
        // simple header
        ({ Text }, context, current, total) => {
          // render in every page
          Text('A Simple Header', {}, {
            x: context.width / 2,
            // negative number (-30 in case) ignore default margins
            y: context.margins.top - 20
          })
        }
      ]
    })

    pdfeasy.add([
      { raw: Utils.loremIpsum().paragraph(), text: {} }
    ])
    
    return expect(pdfeasy.run({
      client: {
        emit: 'none'
      }
    })).resolves.toBeTruthy()
  })
})