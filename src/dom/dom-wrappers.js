const { registerDom } = require('./dom')

/**
 * @name registerHtml
 * @description
 * Function to generate a tagged template function for XHTML / HTML.
 *
 * @param {object} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds HTML components
 *
 * @example
 * import { registerHtml } from 'tram-one'
 * import customHeader from './customHeader'
 * const html = registerHtml({
 *   'custom-header': customHeader
 * })
 *
 *
 * export default () => {
 *   return html`
 *     <div>
 *       <custom-header>Learn about Tram-One!</custom-header>
 *       <span>That header sure was neat</span>
 *     </div>
 *   `
 * }
 */
const registerHtml = registry => {
	return registerDom(null, registry)
}

/**
 * @name registerSvg
 * @description
 * Function to generate a tagged template function for SVG.
 *
 * @param {object} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds SVG components
 *
 * @example
 * import { registerSvg } from 'tram-one'
 * import customHeader from './customHeader'
 * const svg = registerSvg()
 *
 *
 * export default () => {
 *   return svg`
 *     <svg viewBox="0 0 864 864">
 *       <g>
 *         <circle fill="#FDF491" cx="100" cy="100" r="20"/>
 *       </g>
 *     </svg>
 *   `
 * }
 */
const registerSvg = registry => {
	return registerDom('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerHtml, registerSvg }
