const { getEngine } = require('../engine')
const { assertGlobalSpaceAndEngine } = require('../asserts')

const assertEngine = assertGlobalSpaceAndEngine('logName')

const setupLog = (globalSpace = window, logName) => {
  assertEngine(globalSpace, logName)

  // we do not have a space to put our log
  if (!globalSpace) return false

  globalSpace[logName] = {}
  return globalSpace[logName]
}

const getLog = (globalSpace = window, logName) => {
  assertEngine(globalSpace, logName)

  return getEngine(globalSpace, logName)
}

const clearLog = (globalSpace = window, logName) => {
  assertEngine(globalSpace, logName)

  const logStore = getLog(globalSpace, logName)

  // if there is no log store, return an empty object
  if (!logStore) return {}

  Object.keys(logStore).forEach(key => delete logStore[key])
}

module.exports = { setupLog, getLog, clearLog }
