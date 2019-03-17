const { getEngine } = require('../engine')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertGlobalSpaceAndEngine, assertIsFunction } = require('../asserts')

const useState = (globalSpace = window, engineName = 'stateEngine') => {
  assertGlobalSpaceAndEngine('stateEngine')(globalSpace, engineName)

  return (value) => {
    // get a state engine
    const stateEngine = getEngine(globalSpace, engineName)

    // if we couldn't, just return whatever value we got
    if (!stateEngine) return [value, () => {}]

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, 'hookKey')
    incrementWorkingKeyBranch(globalSpace, 'hookKey')

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

const useEffect = (globalSpace = window, engineName = 'effectStore') => {
  assertGlobalSpaceAndEngine('effectStore')(globalSpace, engineName)

  return (onEffect) => {
    assertIsFunction(onEffect, 'effect')

    // get the store of effects
    const effectStore = getEngine(globalSpace, 'effectStore')

    // if there is no store, call and return
    if (!effectStore) return onEffect()

    // get the key value from working-key
    const key = getWorkingKeyValue(globalSpace, 'hookKey')
    incrementWorkingKeyBranch(globalSpace, 'hookKey')

    effectStore[key] = onEffect
  }
}

const useStore = (globalSpace = window, engineName = 'appEngine') => {
  assertGlobalSpaceAndEngine('appEngine')(globalSpace, engineName)

  const engine = getEngine(globalSpace, engineName)

  // if there is no store, return false
  if (!engine) return false

  return () => [engine.store, engine.actions]
}

module.exports = { useEffect, useState, useStore }
