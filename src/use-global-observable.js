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
 * Sandbox for useGlobalObservable
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-global-observable-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 *
 * @param {string} key a unique string to write and read the global value
 * @param {any} [value] the default value if the global store has not been defined yet
 *
 * @returns {Array} array whose first index is the current value,
 * whose second index is a function that can be used to set the value,
 * and whose third index is a non-observed version of the value.
 */
module.exports = (key, value) => observableHook(key, value)
