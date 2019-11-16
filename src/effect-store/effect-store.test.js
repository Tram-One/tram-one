const { setupEffectStore, getEffectStore, clearEffectStore } = require('./effect-store')

describe('effectStore', () => {
	describe('setupEffectStore', () => {
		it('should create new effectStore if none exists', () => {
			const mockSpace = {}
			const setupResult = setupEffectStore(mockSpace, 'mock-effect-store')
			expect(setupResult).toBeDefined()
		})
	})

	describe('getEffectStore', () => {
		it('should return effectStore if it has been setup', () => {
			const mockSpace = {}
			const effectStore = setupEffectStore(mockSpace, 'mock-effect-store')
			const getResult = getEffectStore(mockSpace, 'mock-effect-store')
			expect(getResult).toBe(effectStore)
		})
	})

	describe('clearEffectStore', () => {
		it('should return an empty object if there is no globalSpace', () => {
			const clearResult = clearEffectStore(null, 'mock-effect-store')
			expect(clearResult).toEqual({})
		})

		it('should return an empty object if there is no effectStore', () => {
			const mockSpace = {}
			const clearResult = clearEffectStore(mockSpace, 'mock-effect-store')
			expect(clearResult).toEqual({})
		})

		it('should clear existing effectStore if one exists', () => {
			const mockSpace = {}
			const effectStore = setupEffectStore(mockSpace, 'mock-effect-store')
			effectStore['mock-value'] = 10
			const clearResult = clearEffectStore(mockSpace, 'mock-effect-store')
			expect(clearResult).toEqual({})
			expect(effectStore['mock-value']).toBeUndefined()
		})
	})
})
