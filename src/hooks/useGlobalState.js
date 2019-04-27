const { TRAM_GLOBAL_STATE_ENGINE } = require('../engine-names')
const { getEngine } = require('../engine')
const { assertGlobalSpaceAndEngine, assertIsDefined } = require('../asserts')

module.exports = (globalSpace = window, engineName = TRAM_GLOBAL_STATE_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_GLOBAL_STATE_ENGINE)(globalSpace, engineName)

  return (key, value) => {
    assertIsDefined(key, 'key')

    // get a state engine
    const stateEngine = getEngine(globalSpace, engineName)

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
    const keyGetter =  stateEngine.store[key]

    // generate setter for key
    const keySetter = stateEngine.actions[`set${key}`]

    return [keyGetter, keySetter]
  }
}
