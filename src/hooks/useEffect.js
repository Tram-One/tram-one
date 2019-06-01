const { TRAM_HOOK_KEY, TRAM_EFFECT_STORE } = require('../engine-names')
const { getLog } = require('../log')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertGlobalSpaceAndEngine, assertIsFunction } = require('../asserts')

/**
 * This file defines one function, useEffect, which is a hook that
 * that enables side-effects for tram-one components.
 *
 * In it's current implementation, it only triggers when a component mounts
 * and when it is cleaned up (which is unique from React's implementation which
 * calls on every render). The logic for when it triggers is in `mount()`
 *
 * @see https://tram-one.io/api/#Tram-One#useEffect
 */

module.exports = (globalSpace, storeName = TRAM_EFFECT_STORE, workingKeyName = TRAM_HOOK_KEY) => {
  assertGlobalSpaceAndEngine(TRAM_EFFECT_STORE, globalSpace, storeName)

  return (onEffect) => {
    assertIsFunction(onEffect, 'effect')

    // get the store of effects
    const effectStore = getLog(globalSpace, storeName)

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, workingKeyName)

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
    incrementWorkingKeyBranch(globalSpace, workingKeyName)

    effectStore[key] = onEffect
  }
}
