const { registerHtml } = require('../dom')
const { start } = require('./start')
const html = registerHtml()()

describe('start', () => {
  describe('without globalSpace', () => {
    it('should return function that can mount', () => {
      const startNoGlobal = start()

      const mockSelector = document.createElement('div')
      const mockComponent = () => {
        return html`<div><h1>Mock Component</h1></div>`
      }

      startNoGlobal(mockSelector, mockComponent)

      expect(mockSelector.innerHTML).toBe('<div><h1>Mock Component</h1></div>')
    })
  })

  describe('with globalSpace', () => {
    it('should return function that can mount', () => {
      const mockSpace = {}
      const startWithGlobal = start(mockSpace)

      const mockSelector = document.createElement('div')
      const mockComponent = () => {
        return html`<div><h1>Mock Component</h1></div>`
      }

      startWithGlobal(mockSelector, mockComponent)

      expect(mockSelector.innerHTML).toBe('<div><h1>Mock Component</h1></div>')
    })
  })
})
