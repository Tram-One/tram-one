const { TRAM_HOOK_KEY, TRAM_EFFECT_STORE, TRAM_APP_ENGINE, TRAM_STATE_ENGINE } = require('../engineNames')
const { getEngine } = require('../engine')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertGlobalSpaceAndEngine, assertIsFunction } = require('../asserts')

const useState = (globalSpace = window, engineName = TRAM_STATE_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_STATE_ENGINE)(globalSpace, engineName)

  return (value) => {
    // get a state engine
    const stateEngine = getEngine(globalSpace, engineName)

    // if we couldn't, just return whatever value we got
    if (!stateEngine) return [value, () => {}]

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, TRAM_HOOK_KEY)
    incrementWorkingKeyBranch(globalSpace, TRAM_HOOK_KEY)

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

const useEffect = (globalSpace = window, engineName = TRAM_EFFECT_STORE) => {
  assertGlobalSpaceAndEngine(TRAM_EFFECT_STORE)(globalSpace, engineName)

  return (onEffect) => {
    assertIsFunction(onEffect, 'effect')

    // get the store of effects
    const effectStore = getEngine(globalSpace, TRAM_EFFECT_STORE)

    // if there is no store, call and return
    if (!effectStore) return onEffect()

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, TRAM_HOOK_KEY)
    incrementWorkingKeyBranch(globalSpace, TRAM_HOOK_KEY)

    effectStore[key] = onEffect
  }
}

const useStore = (globalSpace = window, engineName = TRAM_APP_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_APP_ENGINE)(globalSpace, engineName)

  return () => {
    const engine = getEngine(globalSpace, engineName)

    // if there is no store, return false
    if (!engine) return []

    return [engine.store, engine.actions]
  }
}

module.exports = { useEffect, useState, useStore }
