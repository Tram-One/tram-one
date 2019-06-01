const { assertGlobalSpaceAndEngine } = require('../asserts')
const { setup, get } = require('../namespace')

/**
 * Logs in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with working keys and useEffect to keep track of what
 * effects should be triggered or cleaned up.
 */

const setupLog = setup(() => ({}))

const getLog = get

const clearLog = (globalSpace, logName) => {
  assertGlobalSpaceAndEngine('logName', globalSpace, logName)

  const logStore = getLog(globalSpace, logName)

  // if there is no log store, return an empty object
  if (!logStore) return {}

  Object.keys(logStore).forEach(key => delete logStore[key])

  return logStore
}

module.exports = { setupLog, getLog, clearLog }
