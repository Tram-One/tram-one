const mount = require('./mount')
const buildContainer = require('./build-mounting-container')
const { TRAM_EFFECT_STORE, TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE, TRAM_OBSERVABLE_STORE, TRAM_MUTATION_OBSERVER } = require('./engine-names')
const { setupTramOneSpace } = require('./namespace')
const { setupEffectStore } = require('./effect-store')
const { setupWorkingKey } = require('./working-key')
const { setupObservableStore } = require('./observable-store')
const { setupMutationObserver, startWatcher } = require('./mutation-observer')
const startFocusTracker = require('./start-focus-tracker')

/**
 * @name start
 * @link https://tram-one.io/#start
 * @description
 * Function to attach a component to an existing element on the page.
 * This function also starts all the listeners and allows the basic hooks to function.
 *
 * This should only be called for the initial render / building of the app.
 *
 * @param {function} component top-level component to attach to the page.
 * @param {string|Node} target either a CSS selector, or Node to attach the component to
 */
module.exports = (component, target) => {
	/* setup all the internal engines required for tram-one to work */

	// get the container to mount the app on
	const container = buildContainer(target)

	setupTramOneSpace()

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

	// watch for changes on the target so that we can process node changes
	startWatcher(TRAM_MUTATION_OBSERVER, container)

	// watch for focus on inputs, so we can preserve them between renders
	startFocusTracker(container)

	// trigger an initial mount
	mount(component, container)
}
