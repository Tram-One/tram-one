const { TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { getEffectStore } = require('../effect-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertGlobalSpaceAndEngine, assertIsFunction } = require('../asserts')

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

module.exports = (globalSpace, storeName = TRAM_EFFECT_QUEUE, workingKeyName = TRAM_HOOK_KEY) => {
  assertGlobalSpaceAndEngine(TRAM_EFFECT_QUEUE, globalSpace, storeName)

  return (onEffect, triggers = []) => {
    assertIsFunction(onEffect, 'effect')

    // get the store of effects
    const effectStore = getEffectStore(globalSpace, storeName)

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

    // if we have triggers, append them to the key
    // this will make calls with new / different triggers to restart the effect
    const formatTriggers = triggers.join(':')
    const keyWithTriggers = `${key}(${formatTriggers})`

    effectStore[keyWithTriggers] = onEffect
  }
}
