const { setupLog } = require('../log')
const { setupWorkingKey } = require('../working-key')
const useEffect = require('./useEffect')

describe('useEffect', () => {
  describe('with no global space', () => {
    it('should immediately run the start effect', () => {
      const useEffectNoGlobal = useEffect(null, 'mock-effect-store', 'mock-working-key')
      const startEffect = jest.fn()
      const mockEffect = () => {
        startEffect()
      }
      useEffectNoGlobal(mockEffect)
      expect(startEffect).toHaveBeenCalled()
    })

    it('should immediately run the cleanup effect', () => {
      const useEffectNoGlobal = useEffect(null, 'mock-effect-store', 'mock-working-key')
      const endEffect = jest.fn()
      const mockEffect = () => {
        return endEffect
      }
      useEffectNoGlobal(mockEffect)
      expect(endEffect).toHaveBeenCalled()
    })
  })

  describe('with no effect store', () => {
    it('should immediately run the start effect', () => {
      const mockSpace = {}
      const useEffectNoStore = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const startEffect = jest.fn()
      const mockEffect = () => {
        startEffect()
      }
      useEffectNoStore(mockEffect)
      expect(startEffect).toHaveBeenCalled()
    })

    it('should immediately run the cleanup effect', () => {
      const mockSpace = {}
      const useEffectNoStore = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const endEffect = jest.fn()
      const mockEffect = () => {
        return endEffect
      }
      useEffectNoStore(mockEffect)
      expect(endEffect).toHaveBeenCalled()
    })
  })

  describe('without working key', () => {
    it('should immediately run the start effect', () => {
      const mockSpace = {}
      setupLog(mockSpace, 'mock-effect-store')
      const useEffectNoKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const startEffect = jest.fn()
      const mockEffect = () => {
        startEffect()
      }
      useEffectNoKey(mockEffect)
      expect(startEffect).toHaveBeenCalled()
    })

    it('should immediately run the cleanup effect', () => {
      const mockSpace = {}
      setupLog(mockSpace, 'mock-effect-store')
      const useEffectNoKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const endEffect = jest.fn()
      const mockEffect = () => {
        return endEffect
      }
      useEffectNoKey(mockEffect)
      expect(endEffect).toHaveBeenCalled()
    })
  })

  describe('with new working key and store', () => {
    it('should not immediately run the start effect', () => {
      const mockSpace = {}
      setupLog(mockSpace, 'mock-effect-store')
      setupWorkingKey(mockSpace, 'mock-working-key')
      const useEffectWithStoreAndKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const startEffect = jest.fn()
      const mockEffect = () => {
        startEffect()
      }
      useEffectWithStoreAndKey(mockEffect)
      expect(startEffect).not.toHaveBeenCalled()
    })

    it('should store the effect in the effect store', () => {
      const mockSpace = {}
      setupLog(mockSpace, 'mock-effect-store')
      setupWorkingKey(mockSpace, 'mock-working-key')
      const useEffectWithStoreAndKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
      const startEffect = jest.fn()
      const mockEffect = () => {
        startEffect()
      }
      useEffectWithStoreAndKey(mockEffect)
      expect(mockSpace['mock-effect-store']['[0]']).toBe(mockEffect)
    })
  })
})
