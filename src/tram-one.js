const { registerHtml, registerSvg } = require('./dom-wrappers')
const useEffect = require('./use-effect')
const useUrlParams = require('./use-url-params')
const useStore = require('./use-store')
const useGlobalStore = require('./use-global-store')
const start = require('./start')

/**
 * @name Tram-One
 * @package
 * @public
 * @description
 * Tram-One is a Modern View Framework that has advance features like hooks, observables, and JSX-like template components, all in plain vanilla javascript.
 * This framework exposes several functions and hooks to help you start developing.
 *
 * To learn more, checkout the api and guides on https://tram-one.io
 */
module.exports = {
	registerHtml,
	registerSvg,
	useEffect,
	useStore,
	useGlobalStore,
	useUrlParams,
	start
}
