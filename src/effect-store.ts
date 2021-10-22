/*
 * EffectStores in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with useEffect to keep track of what
 * new effects should be triggered or cleaned up
 */

const { setup, get, set } = require('./namespace')

export const setupEffectStore = setup(() => ({}))

export const getEffectStore = get

const setEffectStore = set

/**
 * clear the effect store
 * usually called when we want to empty the effect store
 */
export const clearEffectStore = (effectName: string) => {
	const effectStore = getEffectStore(effectName)

	Object.keys(effectStore).forEach(key => delete effectStore[key])
}

/**
 * restore the effect store to a previous value
 * usually used when we had to interrupt the processing of effects
 */
export const restoreEffectStore = setEffectStore
