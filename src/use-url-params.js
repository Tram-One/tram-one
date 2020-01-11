const urlListener = require('url-listener')
const useUrlParams = require('use-url-params')
const useObservable = require('./use-observable')

/**
 * @name useUrlParams
 * @memberof Tram-One
 * @public
 * @description
 * Hook that returns path variables based on the route.
 * Can return path parameters, query params, and more.
 * It's internal functionality is powered by the package
 * {@link https://www.npmjs.com/package/rlite-router | rlite}
 *
 * Sandbox for path checking in useUrlParams
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-url-params-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 *
 * Sandbox for reading params
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-url-params-example-two/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 *
 * @param {String} [pattern] path to match on (can include path variables)
 *
 * @returns {Object|Boolean} object with params if path matches, otherwise returns false
 */
module.exports = pattern => {
	// save and update results in an observable, so that we can update
	// components and effects in a reactive way
	const initialParams = useUrlParams(pattern)
	const [observedUrlParams, setUrlParams] = useObservable(initialParams)

	// urlListener can re-read the route and save the new results to the observable
	urlListener(() => {
		const updatedParams = useUrlParams(pattern)

		// in cases where useUrlParams returned false, set with the new value
		if (updatedParams === false || observedUrlParams === false) {
			setUrlParams(updatedParams)
		} else {
			// get all keys so we can override new and old ones (without having to override the whole object)
			const allParamKeys = [...Object.keys(observedUrlParams), ...Object.keys(updatedParams)]
			allParamKeys.forEach(paramKey => {
				observedUrlParams[paramKey] = updatedParams[paramKey]
			})
		}
	})

	return observedUrlParams
}
