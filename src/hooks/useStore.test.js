const { setupEngine } = require('../engine')
const useStore = require('./useStore')

describe('useStore', () => {
  describe('with no global space', () => {
    it('should return empty array', () => {
      const useStoreNoGlobal = useStore(null, 'mock-engine')
      const [store, actions] = useStoreNoGlobal()
      expect(store).toBeUndefined()
      expect(actions).toBeUndefined()
    })
  })

  describe('with no engine', () => {
    it('should return empty array', () => {
      const mockSpace = {}
      const useStoreNoEngine = useStore(mockSpace, 'mock-engine')
      const [store, actions] = useStoreNoEngine()
      expect(store).toBeUndefined()
      expect(actions).toBeUndefined()
    })
  })

  describe('with engine', () => {
    it('should store and actions', () => {
      const mockSpace = {}
      const mockEngine = setupEngine(mockSpace, 'mock-engine')
      const useStoreWithEngine = useStore(mockSpace, 'mock-engine')
      const [store, actions] = useStoreWithEngine()
      expect(store).toBe(mockEngine.store)
      expect(actions).toBe(mockEngine.actions)
    })
  })
})
