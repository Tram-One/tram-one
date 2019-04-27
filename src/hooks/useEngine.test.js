const { setupEngine } = require('../engine')
const useEngine = require('./useEngine')

describe('useEngine', () => {
  describe('with no global space', () => {
    it('should return empty array', () => {
      const useEngineNoGlobal = useEngine(null, 'mock-engine')
      const [store, actions] = useEngineNoGlobal()
      expect(store).toBeUndefined()
      expect(actions).toBeUndefined()
    })
  })

  describe('with no engine', () => {
    it('should return empty array', () => {
      const mockSpace = {}
      const useEngineNoEngine = useEngine(mockSpace, 'mock-engine')
      const [store, actions] = useEngineNoEngine()
      expect(store).toBeUndefined()
      expect(actions).toBeUndefined()
    })
  })

  describe('with engine', () => {
    it('should store and actions', () => {
      const mockSpace = {}
      const mockEngine = setupEngine(mockSpace, 'mock-engine')
      const useEngineWithEngine = useEngine(mockSpace, 'mock-engine')
      const [store, actions] = useEngineWithEngine()
      expect(store).toBe(mockEngine.store)
      expect(actions).toBe(mockEngine.actions)
    })
  })
})
