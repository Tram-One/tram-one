const { assertGlobalSpaceAndEngine } = require('../asserts')
const { setup, get } = require('../namespace')

const setupLog = setup(() => ({}))

const getLog = get

const clearLog = (globalSpace = window, logName) => {
  assertGlobalSpaceAndEngine('logName', globalSpace, logName)

  const logStore = getLog(globalSpace, logName)

  // if there is no log store, return an empty object
  if (!logStore) return {}

  Object.keys(logStore).forEach(key => delete logStore[key])

  return logStore
}

module.exports = { setupLog, getLog, clearLog }
