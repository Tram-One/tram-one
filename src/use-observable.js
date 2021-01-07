const observableHook = require('./observable-hook')

/**
 * @name useObservable
 * @link https://tram-one.io/#use-observable
 * @description
 * Hook that stores local component state.
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * @param {any} value the default value to start the state at
 *
 * @returns {Array} array whose first index is the current value,
 * whose second index is a function that can be used to set the value,
 * and whose third index is a non-observed version of the value.
 */
module.exports = value => observableHook(undefined, value)
