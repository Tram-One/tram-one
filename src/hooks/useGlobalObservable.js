const observableHook = require('./observableHook')

/**
 * @name useGlobalObservable
 *
 * @description
 * Hook that stores global state and makes it accessible in the component.
 * This in part fills the role of React's Context API, but mimics the interface of React's useState or Tram-One's useObservable hook
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * @note
 * if storing an object or array, you should mutate the subfields directly,
 * and avoid using the setter that is returned. This will be more performant,
 * and cause only components that are reactive to the sub-fields to update.
 *
 * @param {string} key a unique string to write and read the global value
 * @param {any} [value] the default value if the global store has not been defined yet
 *
 * @returns {[any, function]} getter and setter
 *
 * @example
 * import { registerHtml, useGlobalObservable } from 'tram-one'
 * const html = registerHtml()
 *
 * export default () => {
 *   const [count] = useGlobalObservable('global-counter')
 *   return html`<button>${count}</button>`
 * }
 */
module.exports = (key, value) => observableHook(key, value)
