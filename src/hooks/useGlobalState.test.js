const HoverEngine = require('hover-engine')
const { setup } = require('../namespace')
const useGlobalState = require('./useGlobalState')

const setupEngine = setup(() => new HoverEngine())

describe('useGlobalState', () => {
	describe('with no global space', () => {
		it('should return value that was passed in', () => {
			const useGlobalStateNoGlobal = useGlobalState(null, 'mock-engine')
			const [value] = useGlobalStateNoGlobal('mock-key', 10)
			expect(value).toEqual(10)
		})

		it('should return no-op for setValue', () => {
			const useGlobalStateNoGlobal = useGlobalState(null, 'mock-engine')
			const [, setValue] = useGlobalStateNoGlobal('mock-key', 10)
			setValue(20) // should not fail
		})
	})

	describe('with no engine', () => {
		it('should return value that was passed in', () => {
			const mockSpace = {}
			const useGlobalStateNoEngine = useGlobalState(mockSpace, 'mock-engine')
			const [value] = useGlobalStateNoEngine('mock-key', 10)
			expect(value).toEqual(10)
		})

		it('should return no-op for setValue', () => {
			const mockSpace = {}
			const useGlobalStateNoEngine = useGlobalState(mockSpace, 'mock-engine')
			const [, setValue] = useGlobalStateNoEngine('mock-key', 10)
			setValue(20) // should not fail
		})
	})

	describe('with engine', () => {
		it('should return value that was passed in', () => {
			const mockSpace = {}
			setupEngine(mockSpace, 'mock-engine')
			const useGlobalStateWithEngine = useGlobalState(mockSpace, 'mock-engine')
			const [value] = useGlobalStateWithEngine('mock-key', 10)
			expect(value).toEqual(10)
		})

		it('should return callable function for setValue', () => {
			const mockSpace = {}
			setupEngine(mockSpace, 'mock-engine')
			const useGlobalStateWithEngine = useGlobalState(mockSpace, 'mock-engine')
			const [, setValue] = useGlobalStateWithEngine('mock-key', 10)
			setValue(20) // should not fail

			const [newValue] = useGlobalStateWithEngine('mock-key', 10)
			expect(newValue).toBe(20)
		})
	})
})
