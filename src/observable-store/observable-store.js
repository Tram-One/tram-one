const { observable } = require('@nx-js/observer-util')
const { setup, get } = require('../namespace')

/**
 * EffectStores in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with working keys and useEffect to keep track of what
 * effects should be triggered or cleaned up.
 */

const setupObservableStore = setup(() => observable({}))

const getObservableStore = get

module.exports = { setupObservableStore, getObservableStore }
