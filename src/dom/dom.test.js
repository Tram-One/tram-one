const { setupWorkingKey } = require('../working-key')
const { setupRenderLock } = require('../render-lock')
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

			it('should support custom elements in registry', () => {
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
		})

		describe('with global space', () => {
			it('should return an html function that creates DOM', () => {
				const mockSpace = {}
				const html = registerDom(mockSpace)(null)
				const div = html`<div>Some Text</div>`

				expect(div.outerHTML).toEqual('<div>Some Text</div>')
			})
			it('should update the working key in global space inside a registered elements', () => {
				const mockSpace = {}
				setupWorkingKey(mockSpace, 'mock-key')
				setupRenderLock(mockSpace, 'mock-lock')

				const baseHtml = registerDom(mockSpace, 'mock-key', 'mock-lock')(null)
				const inside = (attrs, children) => {
					expect(mockSpace['mock-key'].branch).toEqual(['inside'])
					return baseHtml`<div ${attrs}>${children}</div>`
				}

				const html = registerDom(mockSpace, 'mock-key', 'mock-lock')(null, {
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
