const { registerHtml, registerSvg } = require('./dom-wrappers')
const useEffect = require('./use-effect')
const useUrlParams = require('./use-url-params')
const useObservable = require('./use-observable')
const useGlobalObservable = require('./use-global-observable')
const start = require('./start')

/**
 * @name Tram-One
 * @package
 * @public
 * @description
 * Tram-One is a light View Framework that comes with all the dependencies you need to start developing on the web.
 * This framework exposes several functions and hooks to help you start developing.
 *
 * To learn more, checkout the api and guides on https://tram-one.io
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
