const { registerHtml, registerSvg } = require('../dom')
const { useEffect, useUrlParams, useObservable, useGlobalObservable } = require('../hooks')
const start = require('../start')

/**
 * Tram-One is a light View Framework that comes with all the dependencies you need to start developing on the web.
 * This framework exposes several functions and hooks to help you start developing.
 *
 * To learn more, checkout the tutorials and guides on https://tram-one.io
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
