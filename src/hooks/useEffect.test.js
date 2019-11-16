const { setupEffectStore } = require('../effect-store')
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

	describe('with no effect store or key', () => {
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

	describe('with new working key and store', () => {
		it('should not immediately run the start effect', () => {
			const mockSpace = {}
			setupEffectStore(mockSpace, 'mock-effect-store')
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
			setupEffectStore(mockSpace, 'mock-effect-store')
			setupWorkingKey(mockSpace, 'mock-working-key')
			const useEffectWithStoreAndKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
			const startEffect = jest.fn()
			const mockEffect = () => {
				startEffect()
			}

			useEffectWithStoreAndKey(mockEffect)

			expect(Object.keys(mockSpace['mock-effect-store'])).toContain('[0]()')
			expect(mockSpace['mock-effect-store']['[0]()']).toBe(mockEffect)
		})

		it('should store the effect with triggers', () => {
			const mockSpace = {}
			setupEffectStore(mockSpace, 'mock-effect-store')
			setupWorkingKey(mockSpace, 'mock-working-key')
			const useEffectWithStoreAndKey = useEffect(mockSpace, 'mock-effect-store', 'mock-working-key')
			const startEffect = jest.fn()
			const mockEffect = () => {
				startEffect()
			}

			useEffectWithStoreAndKey(mockEffect, ['mock-trigger', 'mock-second-trigger'])

			expect(Object.keys(mockSpace['mock-effect-store'])).toContain('[0](mock-trigger:mock-second-trigger)')
			expect(mockSpace['mock-effect-store']['[0](mock-trigger:mock-second-trigger)']).toBe(mockEffect)
		})
	})
})
