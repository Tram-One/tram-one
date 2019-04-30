const { setupEngine, getEngine, addActions, addListener } = require('./engine')

describe('engine', () => {
  describe('setupEngine', () => {
    it('should create a new engine if none exists', () => {
      const mockSpace = {}
      const setupResult = setupEngine(mockSpace, 'mock-engine')
      expect(setupResult).toBeTruthy()
      expect(mockSpace['mock-engine']).toEqual(
        expect.objectContaining({
          actions: expect.anything(),
          store: expect.anything()
        })
      )
    })
  })

  describe('getEngine', () => {
    it('should return engine if it has been setup', () => {
      const mockSpace = {}
      const engine = setupEngine(mockSpace, 'mock-engine')
      const getResult = getEngine(mockSpace, 'mock-engine')
      expect(getResult).toBe(engine)
    })
  })

  describe('addActions', () => {
    it('should add new actions to engine', () => {
      const mockSpace = {}
      const engine = setupEngine(mockSpace, 'mock-engine')
      engine.addActions = jest.fn()
      const mockAction = {
        init: () => 0
      }
      addActions(mockSpace, 'mock-engine')(mockAction)
      expect(engine.addActions).toBeCalledWith(mockAction)
    })

    it('should not fail if there is no mock space', () => {
      setupEngine(null, 'mock-engine')
      const mockAction = {
        init: () => 0
      }
      addActions(null, 'mock-engine')(mockAction)
    })
  })

  describe('addListener', () => {
    it('should add new listener to engine', () => {
      const mockSpace = {}
      const engine = setupEngine(mockSpace, 'mock-engine')
      engine.addListener = jest.fn()
      const mockListener = () => {}
      addListener(mockSpace, 'mock-engine')(mockListener)
      expect(engine.addListener).toBeCalledWith(mockListener)
    })

    it('should not fail if there is no mock space', () => {
      setupEngine(null, 'mock-engine')
      const mockListener = () => {}
      addListener(null, 'mock-engine')(mockListener)
    })
  })
})
