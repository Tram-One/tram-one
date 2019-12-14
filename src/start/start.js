const urlListener = require('url-listener')

const { TRAM_EFFECT_STORE, TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE, TRAM_OBSERVABLE_STORE, TRAM_MUTATION_OBSERVER } = require('../engine-names')
const { setupEffectStore } = require('../effect-store')
const { mount } = require('../mount')
const { setupWorkingKey } = require('../working-key')
const { setupObservableStore } = require('../observable-store')
const { setupMutationObserver, watchForRemoval } = require('../mutation-observer')
const { assertIsDefined, assertIsFunction } = require('../asserts')

/**
 * This file defines a single function, start, which is used to
 * initially mount a component onto an existing element.
 *
 * This function also is responsible for starting all the internal engines
 * required for Tram-One to save internal state and trigger re-renders.
 *
 * While this function defines all the engines and when they should trigger,
 * the actual logic for placing the element on the page is contained in the
 * `mount()` function.
 *
 * @see https://tram-one.io/api/#Tram-One#start
 */

const start = (selector, component) => {
	// setup store for effects
	setupEffectStore(TRAM_EFFECT_STORE)

	// setup queue for new effects when resolving mounts
	setupEffectStore(TRAM_EFFECT_QUEUE)

	// setup working key for hooks
	setupWorkingKey(TRAM_HOOK_KEY)

	// setup observable store
	setupObservableStore(TRAM_OBSERVABLE_STORE)

	// setup a mutation observer (for cleaning up removed elements)
	setupMutationObserver(TRAM_MUTATION_OBSERVER)
	watchForRemoval(TRAM_MUTATION_OBSERVER, document)

	assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
	assertIsFunction(component, 'component')

	// wire up urlListener so that we remount whenever the url changes
	urlListener(() => {
		mount(selector, component)
	})

	// trigger an initial mount
	mount(selector, component)
}

module.exports = { start }
