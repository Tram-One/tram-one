const { TRAM_GLOBAL_STATE_ENGINE } = require('../engine-names')
const { get } = require('../namespace')
const { assertGlobalSpaceAndEngine, assertIsDefined } = require('../asserts')

/**
 * This file defines one function, useGlobalState, which is a hook that
 * that enables global app state.
 *
 * This function has a similar interface to `useState()` but can be used to
 * pull values in many different components (and avoid prop drilling). In this
 * way it is similar to React's Context API, but does not require a Provider Component.
 *
 * Under the hood it uses Hover-Engine to save values and trigger re-renders.
 *
 * @see https://tram-one.io/api/#Tram-One#useGlobalState
 */

module.exports = (globalSpace, engineName = TRAM_GLOBAL_STATE_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_GLOBAL_STATE_ENGINE, globalSpace, engineName)

  return (key, value) => {
    assertIsDefined(key, 'key')

    // get a state engine
    const stateEngine = get(globalSpace, engineName)

    // if we couldn't get an engine or working key, just return whatever value we got
    if (!stateEngine || !key) return [value, () => {}]

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
    const keyGetter = stateEngine.store[key]

    // generate setter for key
    const keySetter = stateEngine.actions[`set${key}`]

    return [keyGetter, keySetter]
  }
}
