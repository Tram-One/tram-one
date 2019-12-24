/**
 * @private
 * @description
 * Function to return the object where tram-one global stores are availble.
 * If when called there are no global stores defined, it makes one on `global` or `window`
 */
module.exports.getTramSpace = () => {
	const globalSpaceIsDefined = typeof global.tramSpace !== 'undefined'
	const windowIsDefined = typeof window !== 'undefined'

	// by default, if tramSpace is set, use that as globalSpace
	if (globalSpaceIsDefined) return global.tramSpace

	// if a window exists, use that as the globalSpace
	if (windowIsDefined) return window

	// if tramSpace and window are undefined,
	// set the globalSpace to a new empty object
	global.tramSpace = {}
	return global.tramSpace
}
