const ensureFunction = require('type/function/ensure')
const ensureValue = require('type/value/ensure')
const { startWatcher } = require('./mutation-observer')
const { registerHtml } = require('./dom-wrappers')
const { TRAM_MUTATION_OBSERVER } = require('./engine-names')

/**
 * @private
 * @description
 * Updates a selector with an initial component for the first render.
 */
module.exports = (selector, component) => {
	ensureValue(selector, { errorMessage: `Tram-One: selector should be defined as a CSS Selector or DOM Node, recieved ${selector}` })
	ensureFunction(component, { errorMessage: `Tram-One: component should be a function, recieved ${typeof selector}, ${selector}` })

	// if the selector is a string, try to find the element,
	// otherwise it's probably DOM that we should write directly to
	const target = (typeof selector) === 'string' ? document.querySelector(selector) : selector
	if (target === null) {
		console.error('Tram-One: could not find target, is the element on the page yet?')
		return
	}

	// watch for changes on the target so that we can process node changes
	startWatcher(TRAM_MUTATION_OBSERVER, target)

	// build a div to render the app on
	// - if it doesn't exist as a child of the selector, create one first
	if (!target.firstElementChild) {
		const targetChild = document.createElement('div')
		target.appendChild(targetChild)
	}

	const html = registerHtml({
		app: component
	})

	// this sadly needs to be wrapped in some element so we can process effects
	// - the root node will not have effects applied on it
	const renderedApp = html`<div><app /></div>`
	target.replaceChild(renderedApp, target.firstElementChild)
}
