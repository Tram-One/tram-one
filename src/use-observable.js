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
 * StackBlitz for useObservable with a primitive
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-use-observable-example-one?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 *
 * StackBlitz for useObservable with an object
 * <blockquote>
 *   if storing an object or array, you should mutate the subfields directly,
 *   and avoid using the setter that is returned. This will be more performant,
 *   and cause only components that are reactive to the sub-fields to update.
 * </blockquote>
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-use-observable-example-two?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 * @param {any} value the default value to start the state at
 *
 * @returns {Array} array whose first index is the current value, and whose second index
 * is a function that can be used to set the value.
 */
module.exports = value => observableHook(undefined, value)
