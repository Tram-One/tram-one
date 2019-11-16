const { registerHtml, registerSvg } = require('../dom')
const { useEffect, useState, useUrlParams, useGlobalState } = require('../hooks')
const { start } = require('../start')

/**
 * This file is the main export that is exposed to users of
 * the Tram-One Framework. The functions exposed at the bottom
 * are what is available to users who import the library.
 *
 * The exposed functions use whatever value is defined globally as
 * tramSpace or as window. If neither of these are defined, then some
 * functions may continue to work, but Tram-One will not be able to
 * preserve state.
 *
 * @see https://tram-one.io/api/#Tram-One
 */

const globalSpaceIsDefined = typeof global.tramSpace !== 'undefined'
const windowIsDefined = typeof window !== 'undefined'

const globalSpace = (() => {
	// by default, if tramSpace is set, use that as globalSpace
	if (globalSpaceIsDefined) return global.tramSpace

	// if a window exists, use that as the globalSpace
	if (windowIsDefined) return window

	// if tramSpace and window are undefined,
	// the functions can still operate without a globalSpace defined
	return undefined
})()

module.exports = {
	registerHtml: registerHtml(globalSpace),
	registerSvg: registerSvg(globalSpace),
	useEffect: useEffect(globalSpace),
	useState: useState(globalSpace),
	useGlobalState: useGlobalState(globalSpace),
	useUrlParams: useUrlParams(),
	start: start(globalSpace)
}
