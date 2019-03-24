const { TRAM_HOOK_KEY, TRAM_EFFECT_STORE, TRAM_APP_ENGINE, TRAM_STATE_ENGINE } = require('../engineNames')
const { getEngine } = require('../engine')
const { getLog } = require('../log')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertGlobalSpaceAndEngine, assertIsFunction } = require('../asserts')

const useState = (globalSpace = window, engineName = TRAM_STATE_ENGINE, workingKeyName = TRAM_HOOK_KEY) => {
  assertGlobalSpaceAndEngine(TRAM_STATE_ENGINE)(globalSpace, engineName)

  return (value) => {
    // get a state engine
    const stateEngine = getEngine(globalSpace, engineName)

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, workingKeyName)

    // if we couldn't get an engine or working key, just return whatever value we got
    if (!stateEngine || !key) return [value, () => {}]

    // increment the working key branch value
    // this makes successive useState calls unique (until we reset the key)
    incrementWorkingKeyBranch(globalSpace, workingKeyName)

    // save this value in our stateEngine if we haven't
    // check if we have the action (the store value could be falsy)
    if (!stateEngine.actions[`set${key}`]) {
      stateEngine.addActions({
        [key]: {
          init: () => value,
          [`set${key}`]: (oldValue, newValue) => newValue
        }
      })
    }

    // generate getter for key
    const keyGetter =  stateEngine.store[key]

    // generate setter for key
    const keySetter = stateEngine.actions[`set${key}`]

    return [keyGetter, keySetter]
  }
}

const useEffect = (globalSpace = window, storeName = TRAM_EFFECT_STORE, workingKeyName = TRAM_HOOK_KEY) => {
  assertGlobalSpaceAndEngine(TRAM_EFFECT_STORE)(globalSpace, storeName)

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

const useStore = (globalSpace = window, engineName = TRAM_APP_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_APP_ENGINE)(globalSpace, engineName)

  return () => {
    const engine = getEngine(globalSpace, engineName)

    // if there is no store, return empty array
    if (!engine) return []

    return [engine.store, engine.actions]
  }
}

module.exports = { useEffect, useState, useStore }
