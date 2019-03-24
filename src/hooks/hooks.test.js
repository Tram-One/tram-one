const { setupEngine } = require('../engine')
const { setupLog } = require('../log')
const { setupWorkingKey, resetIndicies } = require('../working-key')
const { useState, useEffect, useStore } = require('./hooks')

describe('hooks', () => {
  describe('useState', () => {
    describe('with no global space', () => {
      it('should return value that was passed in', () => {
        const useStateNoGlobal = useState(null, 'mock-engine')
        const [value, setValue] = useStateNoGlobal(10)
        expect(value).toEqual(10)
      })

      it('should return no-op for setValue', () => {
        const useStateNoGlobal = useState(null, 'mock-engine')
        const [value, setValue] = useStateNoGlobal(10)
        setValue(20) // should not fail
      })
    })

    describe('with no engine', () => {
      it('should return value that was passed in', () => {
        const mockSpace = {}
        const useStateNoEngine = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateNoEngine(10)
        expect(value).toEqual(10)
      })

      it('should return no-op for setValue', () => {
        const mockSpace = {}
        const useStateNoEngine = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateNoEngine(10)
        setValue(20) // should not fail
      })
    })

    describe('without working key', () => {
      it('should return value that was passed in', () => {
        const mockSpace = {}
        setupEngine(mockSpace, 'mock-engine')
        const useStateNoKey = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateNoKey(10)
        expect(value).toEqual(10)
      })

      it('should return no-op for setValue', () => {
        const mockSpace = {}
        setupEngine(mockSpace, 'mock-engine')
        const useStateNoKey = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateNoKey(10)
        setValue(20) // should not fail
      })
    })

    describe('with new working key and engine', () => {
      it('should return value that was passed in', () => {
        const mockSpace = {}
        setupEngine(mockSpace, 'mock-engine')
        setupWorkingKey(mockSpace, 'mock-working-key')
        const useStateWithEngineAndKey = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateWithEngineAndKey(10)
        expect(value).toEqual(10)
      })

      it('should return callable function for setValue', () => {
        const mockSpace = {}
        setupEngine(mockSpace, 'mock-engine')
        const useStateWithEngineAndKey = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateWithEngineAndKey(10)
        setValue(20) // should not fail
      })

      it('should return set value after a reset', () => {
        const mockSpace = {}
        setupEngine(mockSpace, 'mock-engine')
        setupWorkingKey(mockSpace, 'mock-working-key')
        const useStateWithEngineAndKey = useState(mockSpace, 'mock-engine', 'mock-working-key')
        const [value, setValue] = useStateWithEngineAndKey(10)
        setValue(20)
        resetIndicies(mockSpace, 'mock-working-key')
        const [newValue, setNewValue] = useStateWithEngineAndKey(10)
        expect(newValue).toEqual(20)
      })
    })
  })

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
        expect(mockSpace['mock-effect-store']['0']).toBe(mockEffect)
      })
    })
  })

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
})
