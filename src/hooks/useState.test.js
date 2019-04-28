const { setupEngine } = require('../engine')
const { setupWorkingKey, resetIndices } = require('../working-key')
const useState = require('./useState')

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
      resetIndices(mockSpace, 'mock-working-key')
      const [newValue, setNewValue] = useStateWithEngineAndKey(10)
      expect(newValue).toEqual(20)
    })
  })
})
