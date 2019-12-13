const { assertGlobalSpaceAndEngine } = require('../asserts')
const { setup, get } = require('../namespace')

/**
 * EffectStores in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with working keys and useEffect to keep track of what
 * effects should be triggered or cleaned up.
 */

const setupEffectStore = setup(() => ({}))

const getEffectStore = get

const clearEffectStore = (globalSpace, effectName) => {
	assertGlobalSpaceAndEngine('effectName', globalSpace, effectName)

	const effectStore = getEffectStore(globalSpace, effectName)

	// if there is no effect store, return an empty object
	if (!effectStore) return {}

	Object.keys(effectStore).forEach(key => delete effectStore[key])

	return effectStore
}

const restoreEffectStore = (globalSpace, effectName, restoreStore) => {
	assertGlobalSpaceAndEngine('effectName', globalSpace, effectName)

	const effectStore = getEffectStore(globalSpace, effectName)

	if (!effectStore) return

	globalSpace[effectName] = restoreStore
}

module.exports = { setupEffectStore, getEffectStore, clearEffectStore, restoreEffectStore }
