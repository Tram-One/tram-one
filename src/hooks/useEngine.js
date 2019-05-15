const { TRAM_APP_ENGINE } = require('../engine-names')
const { getEngine } = require('../engine')
const { assertGlobalSpaceAndEngine } = require('../asserts')

module.exports = (globalSpace = window, engineName = TRAM_APP_ENGINE) => {
  assertGlobalSpaceAndEngine(TRAM_APP_ENGINE, globalSpace, engineName)

  return () => {
    const engine = getEngine(globalSpace, engineName)

    // if there is no store, return empty array
    if (!engine) return []

    return [engine.store, engine.actions]
  }
}
