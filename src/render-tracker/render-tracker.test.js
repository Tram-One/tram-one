const { setupRenderTracker, getRenderTracker, setRenderTracker } = require('./render-tracker')

describe('render-tracker', () => {
  describe('setupRenderTracker', () => {
    it('should create new render-tracker if none exists', () => {
      const mockSpace = {}
      const setupResult = setupRenderTracker(mockSpace, 'mock-render-tracker')
      expect(setupResult).toBeDefined()
    })
  })

  describe('getRenderTracker', () => {
    it('should return renderTracker if it has been setup', () => {
      const mockSpace = {}
      const renderTracker = setupRenderTracker(mockSpace, 'mock-render-tracker')
      const getResult = getRenderTracker(mockSpace, 'mock-render-tracker')
      expect(getResult).toBe(renderTracker)
    })
  })

  describe('setRenderTracker', () => {
    it('should return value passed in if there is no globalSpace', () => {
      const setResult = setRenderTracker(null, 'mock-render-tracker', false)
      expect(setResult).toEqual({ shouldRender: false })
    })

    it('should return value passed in if there is no renderTracker', () => {
      const mockSpace = {}
      const setResult = setRenderTracker(mockSpace, 'mock-render-tracker', false)
      expect(setResult).toEqual({ shouldRender: false })
    })

    it('should set the value for renderTracker if one exists', () => {
      const mockSpace = {}
      const renderTracker = setupRenderTracker(mockSpace, 'mock-render-tracker')
      const setResult = setRenderTracker(mockSpace, 'mock-render-tracker', false)
      expect(setResult).toEqual({ shouldRender: false })
      expect(renderTracker.shouldRender).toBe(false)
    })
  })
})
