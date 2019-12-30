const { registerDom } = require('./dom')

/**
 * @name registerHtml
 * @memberof Tram-One
 * @public
 * @description
 * Function to generate a tagged template function for XHTML / HTML.
 * Takes in a registry that allows you to import other tag functions and use them in your template string.
 *
 * Sandbox for registerHtml with no registery
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/registerhtml-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 *	 allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
 *	 sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
 * ></iframe>
 *
 * Sandbox for registerHtml with registery
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/registerhtml-example-two/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 *	 allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
 *	 sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
 * ></iframe>
 * @param {object} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds HTML components
 *
 */
const registerHtml = registry => {
	return registerDom(null, registry)
}

/**
 * @name registerSvg
 * @memberof Tram-One
 * @public
 * @description
 * Function to generate a tagged template function for SVG.
 *
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/registersvg-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 *	 allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
 *	 sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
 * ></iframe>
 *
 * @param {object} [registry={}] map of tag names to functions, use this to use custom elements built in tram-one
 *
 * @return {function} tagged template function that builds SVG components
 */
const registerSvg = registry => {
	return registerDom('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerHtml, registerSvg }
