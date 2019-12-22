const mount = require('./mount')
const { TRAM_EFFECT_STORE, TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE, TRAM_OBSERVABLE_STORE, TRAM_MUTATION_OBSERVER } = require('./engine-names')
const { setupEffectStore } = require('./effect-store')
const { setupWorkingKey } = require('./working-key')
const { setupObservableStore } = require('./observable-store')
const { setupMutationObserver } = require('./mutation-observer')

/**
 * @name start
 * @memberof Tram-One
 * @public
 * @description
 * Function to attach a component to an existing element on the page.
 * This function also starts all the listeners and allows the basic hooks to function.
 *
 * This should only be called for the initial render / building of the app.
 *
 * StackBlitz for starting with a selector on the page
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-start-example-one?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 *
 * StackBlitz for starting on a dom element (useful for testing)
 * <iframe
 *	 src="https://stackblitz.com/edit/tram-one-docs-start-example-two?embed=1&file=index.js&hideExplorer=1"
 *	 width="100%"
 *	 height="300px"
 * ></iframe>
 *
 * @param {string|Node} selector either a CSS selector, or Node to attach the component to
 *
 * @param {component} component top-level component to attach to the page.
 */
module.exports = (selector, component) => {
	/* setup all the internal engines required for tram-one to work */

	// setup store for effects
	setupEffectStore(TRAM_EFFECT_STORE)

	// setup queue for new effects when resolving mounts
	setupEffectStore(TRAM_EFFECT_QUEUE)

	// setup working key for hooks
	setupWorkingKey(TRAM_HOOK_KEY)

	// setup observable store
	setupObservableStore(TRAM_OBSERVABLE_STORE)

	// setup a mutation observer for cleaning up removed elements and triggering effects
	setupMutationObserver(TRAM_MUTATION_OBSERVER)

	// trigger an initial mount
	mount(selector, component)
}
