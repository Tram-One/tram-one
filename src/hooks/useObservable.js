const observableHook = require('./observableHook')

/**
 * @name useGlobalObservable
 *
 * @description
 * Hook that stores local component state.
 * This in part mimics React's useState hook, but allows the component to update independentaly
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * @note
 * if storing an object or array, you should mutate the subfields directly,
 * and avoid using the setter that is returned. This will be more performant,
 * and cause only components that are reactive to the sub-fields to update.
 *
 * @param {any} value the default value to start the state at
 *
 * @returns {[any, function]} getter and setter
 *
 * @example
 * import { registerHtml, useObservable } from 'tram-one'
 * const html = registerHtml()
 *
 * export default () => {
 *   const [counter] = useObservable({ count })
 * 	 const increment = () => counter.count += 1
 *
 *   return html`<button onclick=${increment}>${count}</button>`
 * }
 */
module.exports = value => observableHook(undefined, value)
