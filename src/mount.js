const ensureFunction = require('type/function/ensure')
const { registerHtml } = require('./dom-wrappers')

/**
 * Updates a container with an initial component for the first render.
 */
module.exports = (component, container) => {
	ensureFunction(component, { errorMessage: `Tram-One: component should be a function, recieved ${typeof component}, ${component}` })

	const html = registerHtml({
		app: component
	})

	// this sadly needs to be wrapped in some element so we can process effects
	// - the root node will not have effects applied on it
	const renderedApp = html`<div><app /></div>`
	container.replaceChild(renderedApp, container.firstElementChild)
}
