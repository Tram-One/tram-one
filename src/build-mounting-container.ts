const ensureObject = require('type/plain-object/is')

/**
 * Function to determine (or create) the element that we will mount our tram-one app onto
 * @param {string|Node} target either a CSS selector, or Node to attach the component to
 */
export default target => {
	ensureObject(target, { errorMessage: `Tram-One: container should be defined as a CSS Selector or DOM Node, recieved ${typeof target}, ${target}` })

	// if the selector is a string, try to find the element,
	// otherwise it's probably DOM that we should write directly to
	const container = (typeof target) === 'string' ? document.querySelector(target) : target
	if (container === null) {
		throw new Error('Tram-One: could not find target, is the element on the page yet?')
	}

	// build a div to render the app on
	// - if it doesn't exist as a child of the selector, create one first
	if (!container.firstElementChild) {
		const containerChild = document.createElement('div')
		container.appendChild(containerChild)
	}

	return container
}
