const { setup, get } = require('./namespace')

describe('namespace', () => {
  describe('setup', () => {
    describe('with mock constructor', () => {
      let setupMockConstructor

      beforeEach(() => {
        // build setup function with constructor
        const mockConstructor = () => ({
          actions: [],
          store: {}
        })
        setupMockConstructor = setup(mockConstructor)
      })

      it('should return false if there is no global space', () => {
        const setupResult = setupMockConstructor(null, 'mock-engine')
        expect(setupResult).toBeFalsy()
      })

      it('should return existing engine if one already exists', () => {
        const mockEngine = {}
        const mockSpace = {
          'mock-engine': mockEngine
        }
        const setupResult = setupMockConstructor(mockSpace, 'mock-engine')
        expect(setupResult).toBe(mockEngine)
      })

      it('should create a new engine if none exists', () => {
        const mockSpace = {}
        const setupResult = setupMockConstructor(mockSpace, 'mock-engine')
        expect(setupResult).toBeTruthy()
        expect(mockSpace['mock-engine']).toEqual(
          expect.objectContaining({
            actions: expect.anything(),
            store: expect.anything()
          })
        )
      })
    })
  })

  describe('get', () => {
    it('should return falsy if there is no globalSpace', () => {
      const getResult = get(null, 'mock-engine')
      expect(getResult).toBeFalsy()
    })

    it('should return falsy if engine is not setup', () => {
      const mockSpace = {}
      const getResult = get(mockSpace, 'mock-engine')
      expect(getResult).toBeFalsy()
    })

    it('should return engine if it has been setup', () => {
      const mockSpace = {}
      const mockConstructor = () => ({
        actions: [],
        store: {}
      })
      const setupMockConstructor = setup(mockConstructor)
      const engine = setupMockConstructor(mockSpace, 'mock-engine')
      const getResult = get(mockSpace, 'mock-engine')
      expect(getResult).toBe(engine)
    })
  })
})
