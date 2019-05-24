/**
 * @name registerDom
 * @function
 * @memberof Tram
 * @instance
 *
 * @description
 * Function to generate a tagged template function for any namespace.
 * If you need to support a custom xml namespace, you can use this function.
 * This function is the generic interface for `registerHtml` and `registerSvg`,
 * when possible you should use those functions instead.
 *
 * @param {string} [namespace] URI of the namespace, can be undefined, which will build standard XHTML in browsers
 * @param {registry} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds XML components
 *
 * @example
 * const { registerDom } = Tram()
 * const xulNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
 * const xul = registerDom(xulNS)
 *
 *
 * const xulComponent = () => {
 *   return xul`
 *     <window id="findfile-window" title="Find Files" orient="horizontal">
 *       <button id="find-button" label="Find"/>
 *       <button id="cancel-button" label="Cancel"/>
 *     </window>
 *   `
 * }
 */

/**
 * @name registerHtml
 * @function
 * @memberof Tram
 * @instance
 *
 * @description
 * Function to generate a tagged template function for XHTML / HTML.
 *
 * @param {registry} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds HTML components
 *
 * @example
 * import customHeader from './customHeader'
 * const { registerHtml } = Tram()
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

/**
 * @name registerSvg
 * @function
 * @memberof Tram
 * @instance
 *
 * @description
 * Function to generate a tagged template function for SVG.
 *
 * @param {registry} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds SVG components
 *
 * @example
 * import customHeader from './customHeader'
 * const { registerSvg } = Tram()
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
