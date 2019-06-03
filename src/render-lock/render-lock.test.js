const { setupRenderLock, getRenderLock, setRenderLock } = require('./render-lock')

describe('render-lock', () => {
  describe('setupRenderLock', () => {
    it('should create new render-lock if none exists', () => {
      const mockSpace = {}
      const setupResult = setupRenderLock(mockSpace, 'mock-render-lock')
      expect(setupResult).toBeDefined()
    })
  })

  describe('getRenderLock', () => {
    it('should return renderLock if it has been setup', () => {
      const mockSpace = {}
      const renderLock = setupRenderLock(mockSpace, 'mock-render-lock')
      const getResult = getRenderLock(mockSpace, 'mock-render-lock')
      expect(getResult).toBe(renderLock)
    })
  })

  describe('setRenderLock', () => {
    it('should return value passed in if there is no globalSpace', () => {
      const setResult = setRenderLock(null, 'mock-render-lock', false)
      expect(setResult).toEqual({ shouldRender: false })
    })

    it('should return value passed in if there is no renderLock', () => {
      const mockSpace = {}
      const setResult = setRenderLock(mockSpace, 'mock-render-lock', false)
      expect(setResult).toEqual({ shouldRender: false })
    })

    it('should set the value for renderLock if one exists', () => {
      const mockSpace = {}
      const renderLock = setupRenderLock(mockSpace, 'mock-render-lock')
      const setResult = setRenderLock(mockSpace, 'mock-render-lock', false)
      expect(setResult).toEqual({ shouldRender: false })
      expect(renderLock.shouldRender).toBe(false)
    })
  })
})
