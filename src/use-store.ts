import observableHook from './observable-hook'

/**
 * @name useStore
 * @link https://tram-one.io/#use-store
 * @description
 * Hook that stores local component state.
 *
 * If the subfield of an object, or element of an array is updated
 * it will cause only the components that are dependent on that value to update.
 *
 * @param {Object|Array} defaultValue the default value to start the store at
 *
 * @returns {Object|Array} the store to interact with.
 */
export default defaultValue => observableHook(undefined, defaultValue)
