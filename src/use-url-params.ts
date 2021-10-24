const urlListener = require('url-listener')
const useUrlParams = require('use-url-params')

import useStore from './use-store'
import { UrlMatchResults } from './types'

/**
 * @name useUrlParams
 * @link https://tram-one.io/#use-url-params
 * @description
 * Hook that returns path variables based on the route.
 * Can return path parameters, query params, and more.
 * It's internal functionality is powered by the package
 * {@link https://www.npmjs.com/package/rlite-router rlite}
 *
 * @param pattern path to match on (can include path variables)
 *
 * @returns object with a `matches` key, and (if it matched) path and query parameters
 */
export default (pattern: string) : UrlMatchResults => {
	// save and update results in an observable, so that we can update
	// components and effects in a reactive way
	const initialParams = useUrlParams(pattern) as UrlMatchResults
	const observedUrlParams = useStore(initialParams)

	// urlListener can re-read the route and save the new results to the observable
	urlListener(() => {
		const updatedParams = useUrlParams(pattern)

		// get all keys so we can override new and old ones (without having to override the whole object)
		const allParamKeys = [...Object.keys(initialParams), ...Object.keys(updatedParams)]
		allParamKeys.forEach(paramKey => {
			observedUrlParams[paramKey] = updatedParams[paramKey]
		})
	})

	return observedUrlParams
}
