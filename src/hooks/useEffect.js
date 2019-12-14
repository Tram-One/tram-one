const { TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { getEffectStore } = require('../effect-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertIsFunction } = require('../asserts')

/**
 * This file defines one function, useEffect, which is a hook that
 * that enables side-effects for tram-one components.
 *
 * This hook slightly mimics the react implementation, in that if you
 * pass in an array of values, and those differ from a previous call,
 * it will trigger the cleanup of the old effect and start a new one.
 *
 * @see https://tram-one.io/api/#Tram-One#useEffect
 */

module.exports = onEffect => {
	assertIsFunction(onEffect, 'effect')

	// get the store of effects
	const effectStore = getEffectStore(TRAM_EFFECT_QUEUE)

	// get the key value from working-key
	const key = getWorkingKeyValue(TRAM_HOOK_KEY)

	// if there is no store, call start and cleanup
	if (!effectStore || !key) {
		const cleanup = onEffect()
		if (typeof cleanup === 'function') {
			cleanup()
		}

		return
	}

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// append () so that it's easier to debug effects from components
	const callLikeKey = `${key}()`

	effectStore[callLikeKey] = onEffect
}
