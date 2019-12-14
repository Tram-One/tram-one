const { registerHtml, registerSvg } = require('../dom')
const { useEffect, useUrlParams, useObservable, useGlobalObservable } = require('../hooks')
const { start } = require('../start')

/**
 * This file is the main export that is exposed to users of
 * the Tram-One Framework. The functions exposed at the bottom
 * are what is available to users who import the library.
 *
 * @see https://tram-one.io/api/#Tram-One
 */

module.exports = {
	registerHtml,
	registerSvg,
	useEffect,
	useObservable,
	useGlobalObservable,
	useUrlParams,
	start
}
