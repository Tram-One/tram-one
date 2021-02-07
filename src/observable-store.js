const { observable } = require('@nx-js/observer-util')
const { setup, get } = require('./namespace')

/**
 * Observable Stores in Tram-One are used for objects whose properties need to be observed.
 * This stores the values in the useStore and useGlobalStore hooks, internally tracking
 * them as proxies, and making observed functions respond to their changes.
 */

const setupObservableStore = setup(() => observable({}))

const getObservableStore = get

module.exports = { setupObservableStore, getObservableStore }
