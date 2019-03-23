const mockRegister = jest.fn()
jest.mock('./dom', () => ({
  registerDom: (globalSpace) => mockRegister,
}));

const { registerHtml, registerSvg } = require('./dom-wrappers')

describe('dom wrappers', () => {
  describe('registerHtml', () => {
    it('should call registerDom with no namespace', () => {
      const mockSpace = {}
      const mockRegistry = {}
      const testHtml = registerHtml(mockSpace)(mockRegistry)

      expect(mockRegister).toBeCalledWith(null, mockRegistry)
    })
  })

  describe('registerSvg', () => {
    it('should call registerDom with svg namespace', () => {
      const mockSpace = {}
      const mockRegistry = {}
      const testHtml = registerSvg(mockSpace)(mockRegistry)

      expect(mockRegister).toBeCalledWith('http://www.w3.org/2000/svg', mockRegistry)
    })
  })
})
