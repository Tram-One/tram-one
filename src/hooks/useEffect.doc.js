/* types */

/**
 * @typedef {Function} onEffect
 *
 * @description
 * Function that is passed into {@link Tram-One#useEffect | useEffect} hook.
 * It has no parameters. If a function is returned, then
 * that function is called on cleanup.
 *
 *
 * <strong>Note! This is unique from react's useEffect hook in the following ways:</strong>
 * <ul>
 * <li>it takes no dependencies</li>
 * <li>it is not called on update</li>
 * <li>if the component does not return a function, the return is ignored (async effects are okay)</li>
 * </ul>
 *
 * @returns {Function} optional cleanup function to call when component is removed from app
 *
 * @example
 * useEffect(() => {
 *   // user has 5 seconds before seeing alert
 *   const timerId = setTimeout(() => alert(`Time's up!`), 5000)
 *
 *   // if component is removed, clear timer
 *   return () => clearTimeout(timerId)
 * })
 */

/* methods */

/**
 * @name useEffect
 * @function
 * @memberof Tram-One
 * @instance
 *
 * @description
 * Hook that runs when the component first renders.
 * If the result of the function is another function,
 * then that function is called on when the component is removed.
 *
 * @param {onEffect} onEffect function to run on component mount
 *
 * @example
 * import { registerHtml, useEffect } from 'tram-one'
 * const html = registerHtml()
 *
 *
 * export default () => {
 *   useEffect(() => {
 *     document.title = "Page Title"
 *   })
 *
 *   return html`<h1>Page Title</h1>`
 * }
 */
