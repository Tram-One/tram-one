const observableHook = require('./observable-hook')

/**
 * @name useGlobalObservable
 * @link https://tram-one.io/#use-global-observable
 * @description
 * Hook that stores global state and makes it accessible in the entire app.
 *
 * If the subfield of an object, or element of an array is updated
 * it will cause only the components that are dependent on that value to update.
 *
 * @param {string} key a unique string to write and read the global value
 * @param {Object|Array} defaultValue the default value to start the store at
 *
 * @returns {Object|Array} the store to interact with.
 */
module.exports = (key, defaultValue) => observableHook(key, defaultValue)
