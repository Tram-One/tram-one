// const morph = require('tatermorph')
const { observe } = require('@nx-js/observer-util')

const { assertIsDefined, assertIsFunction } = require('../asserts')

/**
 * This file has a single function, mount, which is responsible for updating
 * a selector with a mounted component.
 * This is used for both the initial render, and all successive renders when
 * state is updated, routes change, or other effects described in `start()`
 *
 * Most significantly, mounting involves morphing the existing dom in place, however
 * we also manage effects (triggering new ones, and cleaning up old ones).
 */

const mount = (selector, component) => {
	assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
	assertIsFunction(component, 'component')

	/**
	 * if the selector is a string, try to find the element,
	 * otherwise it's probably DOM that we should write directly to
	 */
	const target = (typeof selector) === 'string' ? document.querySelector(selector) : selector
	if (target === null) {
		console.warn('Tram-One: could not find target, is the element on the page yet?')
	}

	/**
	 * build a div to render the app on
	 * (if it doesn't exist as a child of the selector, create one first)
	 */
	if (!target.firstElementChild) {
		const targetChild = document.createElement('div')
		target.appendChild(targetChild)
	}

	// build the app locally, this may be called several times in a single update

	//
	// TODO use dom function to mount initial component
	//

	let app
	observe(() => {
		app = component()
		target.replaceChild(app, target.firstElementChild)
	})
}

module.exports = { mount }
