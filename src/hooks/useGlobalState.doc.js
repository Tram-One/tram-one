 /**
  * @name useGlobalState
  * @function
  * @memberof Tram-One
  * @instance
  *
  * @description
  * Hook that creates / accesses a globally accessible variable.
  * It has a similar interface and functionality to {@link Tram-One#useState | useState}, but can
  * be used among many different components to access the same value.
  *
  * @param {String} key used to access the same value across multiple components
  * @param {*} [initialValue] the initial value of the variable
  *
  * @returns {Array} array that includes the current value, and a function to update the value
  *
  * @example
  * import { registerHtml, useGlobalState } from 'tram-one'
  * const html = registerHtml()
  *
  * export default () => {
  *   const [counter, updateCounter] = useGlobalState('counter', 0)
  *   const incrementCounter = () => updateCounter(counter + 1)
  *
  *   return html`<button onclick=${incrementCounter}>${counter}</button>`
  * }
  */
