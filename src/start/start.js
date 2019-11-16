const HoverEngine = require('hover-engine')
const urlListener = require('url-listener')

const { TRAM_STATE_ENGINE, TRAM_GLOBAL_STATE_ENGINE, TRAM_EFFECT_STORE, TRAM_HOOK_KEY, TRAM_RENDER_LOCK, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { setup, get } = require('../namespace')
const { setupEffectStore } = require('../effect-store')
const { mount } = require('../mount')
const { setupWorkingKey } = require('../working-key')
const { setupRenderLock } = require('../render-lock')
const { assertIsObject, assertIsDefined, assertIsFunction } = require('../asserts')

const setupEngine = setup(() => new HoverEngine())

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

const start = globalSpace => {
	assertIsObject(globalSpace, 'globalSpace', true)

	// setup dedicated engine for component state
	setupEngine(globalSpace, TRAM_STATE_ENGINE)

	// setup dedicated engine for app state management
	setupEngine(globalSpace, TRAM_GLOBAL_STATE_ENGINE)

	// setup store for effects
	setupEffectStore(globalSpace, TRAM_EFFECT_STORE)

	// setup queue for new effects when resolving mounts
	setupEffectStore(globalSpace, TRAM_EFFECT_QUEUE)

	// setup working key for hooks
	setupWorkingKey(globalSpace, TRAM_HOOK_KEY)

	// setup render count to be 0
	setupRenderLock(globalSpace, TRAM_RENDER_LOCK)

	return (selector, component) => {
		assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
		assertIsFunction(component, 'component')

		const appMount = () => {
			mount(globalSpace)(selector, component)
		}

		// re-mount the app when a state action is triggered
		const stateEngine = get(globalSpace, TRAM_STATE_ENGINE)
		if (stateEngine) {
			stateEngine.addListener(() => {
				appMount()
			})
		}

		// re-mount the app when a global state action is triggered
		const globalStateEngine = get(globalSpace, TRAM_GLOBAL_STATE_ENGINE)
		if (globalStateEngine) {
			globalStateEngine.addListener(() => {
				appMount()
			})
		}

		// wire up urlListener so that we remount whenever the url changes
		urlListener(() => {
			appMount()
		})

		// trigger an initial mount
		appMount()
	}
}

module.exports = { start }
