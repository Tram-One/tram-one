const { registerDom } = require('./dom')

/**
 * @name registerHtml
 * @memberof Tram-One
 * @public
 * @description
 * Function to generate a tagged template function for XHTML / HTML.
 * Takes in a registry that allows you to import other tag functions and use them in your template string.
 *
 * StackBlitz for registerHtml with no registry
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-registerhtml-example-one?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 *
 * StackBlitz for registerHtml with registry (use Ctrl+P to look at `custom-header.js`)
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-registerhtml-example-two?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
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
 * StackBlitz for registerSvg
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-registersvg-example-one?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
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
