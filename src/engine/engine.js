const assert = require('assert')
const HoverEngine = require('hover-engine')

const setupEngine = (globalSpace = window, engineName) => {
  // we do not have a space to put our engine
  if (!globalSpace) return false

  globalSpace[engineName] = new HoverEngine()
  return globalSpace[engineName]
}

const getEngine = (globalSpace = window, engineName) => {
  return globalSpace && globalSpace[engineName]
}

const addActions = (globalSpace = window, engineName = 'appEngine') => {
  return (actionGroups) => {
    assert.equal(
      typeof actionGroups, 'object',
      'Tram-One: ActionGroups should be { store-key: { action-name: action-function } }'
    )

    getEngine(globalSpace, engineName).addActions(actionGroups)

    return Tram
  }
}

const addListener = (globalSpace = window, engineName = 'appEngine') => {
  return (listener) => {
    assert.equal(typeof listener, 'function', 'Tram-One: Listener should be a function')

    getEngine(globalSpace, engineName).addListener(listener)

    return Tram
  }
}

module.exports = { setupEngine, getEngine, addActions, addListener }
