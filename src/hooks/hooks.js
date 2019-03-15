const { getEngine } = require('../engine')

const useState = (globalSpace = window, engineName = 'stateEngine') => {
  return (value, keyPrefix = '') => {
    // get a state engine
    const stateEngine = getEngine(globalSpace, engineName)

    // if we couldn't, just return whatever value we got
    if (!stateEngine) return [value, () => {}]

    // generate key using the stack trace
    const key = keyPrefix + (new Error()).stack.match(/(\d+:\d+)/g).slice(0, 5).join('|')

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
  return (onEffect, keyPrefix = '') => {
    // get the store of effects
    const effectStore = getEngine(globalSpace, 'effectStore')

    // if there is no store, call and return
    if (!effectStore) return onEffect()

    // generate key using the stack trace
    const key = keyPrefix + (new Error()).stack.match(/(\d+:\d+)/g).slice(0, 5).join('|')

    effectStore[key] = onEffect
  }
}

const useStore = (globalSpace = window, engineName = 'appEngine') => {
  const engine = getEngine(globalSpace, engineName)
  return () => [engine.store, engine.actions]
}

module.exports = { useEffect, useState, useStore }
