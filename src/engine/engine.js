const HoverEngine = require('hover-engine')
const { assertGlobalSpaceAndEngine, assertIsObject, assertIsFunction } = require('../asserts')

const assertEngine = assertGlobalSpaceAndEngine('engineName')

const setupEngine = (globalSpace = window, engineName) => {
  assertEngine(globalSpace, engineName)

  // we do not have a space to put our engine
  if (!globalSpace) return false

  globalSpace[engineName] = new HoverEngine()
  return globalSpace[engineName]
}

const getEngine = (globalSpace = window, engineName) => {
  assertEngine(globalSpace, engineName)
  return globalSpace && globalSpace[engineName]
}

const addActions = (globalSpace = window, engineName = 'appEngine') => {
  assertEngine(globalSpace, engineName)
  return (actionGroups) => {
    assertIsObject(actionGroups, 'actionGroups', false, '{ store-key: { action-name: action-function } }')
    getEngine(globalSpace, engineName).addActions(actionGroups)
  }
}

const addListener = (globalSpace = window, engineName = 'appEngine') => {
  assertEngine(globalSpace, engineName)
  return (listener) => {
    assertIsFunction(listener, 'listener')
    getEngine(globalSpace, engineName).addListener(listener)
  }
}

module.exports = { setupEngine, getEngine, addActions, addListener }
