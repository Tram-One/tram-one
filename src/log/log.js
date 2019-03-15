const getEngine = require('../engine')

const setupLog = (globalSpace = window, logName) => {
  // we do not have a space to put our log
  if (!globalSpace) return false

  globalSpace[logName] = {}
  return globalSpace[logName]
}

const getLog = (globalSpace = window, logName) => {
  return getEngine(globalSpace, logName)
}

const clearLog = (globalSpace = window, logName) => {
  const logStore = getLog(globalSpace, logName)

  // if there is no log store, return an empty object
  if (!logStore) return {}

  Object.keys(logStore).forEach(key => delete logStore[key])
}

module.exports = { setupLog, getLog, clearLog }
