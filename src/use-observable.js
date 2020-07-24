const observableHook = require('./observable-hook')

/**
 * @name useObservable
 * @memberof Tram-One
 * @public
 * @description
 * Hook that stores local component state.
 * This in part mimics React's useState hook, but allows the component to update independentaly
 *
 * If the value (or a subfield if it is an object or array) is updated,
 * it will cause only the components that are dependent on that value to update.
 *
 * Sandbox for useObservable with a primitive
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-observable-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 *
 * Sandbox for useObservable with an object
 * <blockquote>
 *   if storing an object or array, you should mutate the subfields directly,
 *   and avoid using the setter that is returned. This will be more performant,
 *   and cause only components that are reactive to the sub-fields to update.
 * </blockquote>
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-observable-example-two/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 * @param {any} value the default value to start the state at
 *
 * @returns {Array} array whose first index is the current value, 
 * whose second index is a function that can be used to set the value,
 * and whose third index is a non-observed version of the value.
 */
module.exports = value => observableHook(undefined, value)
