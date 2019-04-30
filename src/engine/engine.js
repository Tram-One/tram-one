const HoverEngine = require('hover-engine')

const { TRAM_APP_ENGINE } = require('../engine-names')
const { assertGlobalSpaceAndEngine, assertIsObject, assertIsFunction } = require('../asserts')
const { setup, get } = require('../namespace')

const assertEngine = assertGlobalSpaceAndEngine('engineName')

const setupEngine = setup(() => new HoverEngine())

const getEngine = get

const addActions = (globalSpace = window, engineName = TRAM_APP_ENGINE) => {
  assertEngine(globalSpace, engineName)
  return (actionGroups) => {
    assertIsObject(actionGroups, 'actionGroups', false, '{ store-key: { action-name: action-function } }')
    const engine = getEngine(globalSpace, engineName)
    if (engine) { engine.addActions(actionGroups) }
  }
}

const addListener = (globalSpace = window, engineName = TRAM_APP_ENGINE) => {
  assertEngine(globalSpace, engineName)
  return (listener) => {
    assertIsFunction(listener, 'listener')
    const engine = getEngine(globalSpace, engineName)
    if (engine) { engine.addListener(listener) }
  }
}

module.exports = { setupEngine, getEngine, addActions, addListener }
