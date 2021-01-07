const observableHook = require('./observable-hook')

/**
 * @name useGlobalObservable
 * @link https://tram-one.io/#use-global-observable
 * @description
 * Hook that stores global state and makes it accessible in the entire app.
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * @param {string} key a unique string to write and read the global value
 * @param {any} [value] the default value if the global store has not been defined yet
 *
 * @returns {Array} array whose first index is the current value,
 * whose second index is a function that can be used to set the value,
 * and whose third index is a non-observed version of the value.
 */
module.exports = (key, value) => observableHook(key, value)
