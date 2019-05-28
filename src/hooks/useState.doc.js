/**
 * @name useState
 * @function
 * @memberof Tram-One
 * @instance
 *
 * @description
 * Hook that creates / accesses a local component variable.
 *
 *
 * For a variable that can be accessed with the same value
 * throughout the app see {@link Tram-One#useGlobalState | useGlobalState}.
 *
 * @param {*} [initialValue] the initial value of the variable
 *
 * @returns {Array} array that includes the current value, and a function to update the value
 *
 * @example
 * import { registerHtml, useState } from 'tram-one'
 * const html = registerHtml()
 *
 * export default () => {
 *   const [name, setName] = useState('')
 *
 *   const updateNameOnChange = (event) => {
 *     setName(event.target.value)
 *   }
 *
 *   return html`<input placeholder="Name" value=${name} onchange=${updateNameOnChange}/>`
 * }
 */
