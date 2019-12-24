const observableHook = require('./observable-hook')

/**
 * @name useGlobalObservable
 * @memberof Tram-One
 * @public
 * @description
 * Hook that stores global state and makes it accessible in the component.
 * This in part fills the role of React's Context API, but mimics the interface of React's useState or Tram-One's useObservable hook
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * StackBlitz for useGlobalObservable
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-use-global-observable-example-one?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 *
 * @param {string} key a unique string to write and read the global value
 * @param {any} [value] the default value if the global store has not been defined yet
 *
 * @returns {Array} array whose first index is the current value, and whose second index
 * is a function that can be used to set the value.
 */
module.exports = (key, value) => observableHook(key, value)
