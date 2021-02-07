/**
 * Function to return the object where tram-one global stores are availble.
 * If when called there are no global stores defined, it makes one on `global` or `window`
 */
module.exports.getTramSpace = () => {
	const globalSpaceIsDefined = typeof global['tram-space'] !== 'undefined'
	const windowIsDefined = typeof window !== 'undefined'

	// by default, if tramSpace is set, use that as globalSpace
	if (globalSpaceIsDefined) return global['tram-space']

	// if a window exists, use that for the globalSpace
	if (windowIsDefined) {
		window['tram-space'] = window['tram-space'] || {}
		return window['tram-space']
	}

	// if tramSpace and window are undefined,
	// set the globalSpace to a new empty object
	global['tram-space'] = {}
	return global['tram-space']
}
