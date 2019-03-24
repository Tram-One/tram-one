const { setupWorkingKey } = require('../working-key')
const { registerDom } = require('./dom')

// for these tests we don't care so much about the
// resulting space that exists in the DOM
const removeSpacing = domString => domString.replace(/\s/g, '')

describe('dom', () => {
  describe('registerDom', () => {
    describe('without global space', () => {
      it('should return an html function that creates DOM', () => {
        const html = registerDom(null)(null)
        const div = html`<div>Some Text</div>`

        expect(div.outerHTML).toEqual('<div>Some Text</div>')
      })
    })

    describe('with global space', () => {
      it('should return an html function that creates DOM', () => {
        const mockSpace = {}
        const html = registerDom(mockSpace)(null)
        const div = html`<div>Some Text</div>`

        expect(div.outerHTML).toEqual('<div>Some Text</div>')
      })
    })

    describe('with a registry', () => {
      it('should support custom elements in registry (with no global space)', () => {
        const baseHtml = registerDom(null)(null)
        const inside = (attrs, children) => baseHtml`<div ${attrs}>${children}</div>`

        const html = registerDom(null)(null, {
          inside
        })
        const outside = html`
          <div>
            Outside HTML
            <inside someAttr="some attr value">
              Inside HTML
            </inside>
          </div>
        `

        const expectedResult = `
          <div>
            Outside HTML
            <div someAttr="some attr value">
              Inside HTML
            </div>
          </div>
        `
        expect(removeSpacing(outside.outerHTML)).toEqual(removeSpacing(expectedResult))
      })

      it('should update the working key in global space inside a registered elements', () => {
        const mockSpace = {}
        setupWorkingKey(mockSpace, 'mock-key')
        const baseHtml = registerDom(mockSpace, 'mock-key')(null)
        const inside = (attrs, children) => {
          expect(mockSpace['mock-key'].branch).toEqual(['inside'])
          return baseHtml`<div ${attrs}>${children}</div>`
        }

        const html = registerDom(mockSpace, 'mock-key')(null, {
          inside
        })
        const outside = html`
          <div>
            Outside HTML
            <inside someAttr="some attr value">
              Inside HTML
            </inside>
          </div>
        `

        const expectedResult = `
          <div>
            Outside HTML
            <div someAttr="some attr value">
              Inside HTML
            </div>
          </div>
        `
        expect(removeSpacing(outside.outerHTML)).toEqual(removeSpacing(expectedResult))
      })

      it('should not fail with a global space and no setup working key', () => {
        const mockSpace = {}
        const baseHtml = registerDom(mockSpace)(null)
        const inside = (attrs, children) => {
          expect(mockSpace['mock-key']).toBeUndefined()
          return baseHtml`<div ${attrs}>${children}</div>`
        }

        const html = registerDom(mockSpace)(null, {
          inside
        })
        const outside = html`
          <div>
            Outside HTML
            <inside someAttr="some attr value">
              Inside HTML
            </inside>
          </div>
        `

        const expectedResult = `
          <div>
            Outside HTML
            <div someAttr="some attr value">
              Inside HTML
            </div>
          </div>
        `
        expect(removeSpacing(outside.outerHTML)).toEqual(removeSpacing(expectedResult))
      })
    })
  })
})
