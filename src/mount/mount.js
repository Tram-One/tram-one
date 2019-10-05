const morph = require('tatermorph')

const {TRAM_EFFECT_STORE, TRAM_HOOK_KEY, TRAM_RENDER_LOCK, TRAM_EFFECT_QUEUE} = require('../engine-names')
const {getEffectStore, clearEffectStore} = require('../effect-store')
const {getRenderLock, setRenderLock} = require('../render-lock')
const {resetWorkingKey, restoreWorkingKey, copyWorkingKey} = require('../working-key')
const {assertIsObject, assertIsDefined, assertIsFunction} = require('../asserts')

/**
 * This file has a single function, mount, which is responsible for updating
 * a selector with a mounted component.
 * This is used for both the initial render, and all successive renders when
 * state is updated, routes change, or other effects described in `start()`
 *
 * Most significantly, mounting involves morphing the existing dom in place, however
 * we also manage effects (triggering new ones, and cleaning up old ones).
 */

const mount = (globalSpace, effectStore = TRAM_EFFECT_STORE, effectQueue = TRAM_EFFECT_QUEUE, workingKeyName = TRAM_HOOK_KEY, renderLock = TRAM_RENDER_LOCK) => {
	assertIsObject(globalSpace, 'globalSpace', true)

	return (selector, component) => {
		assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
		assertIsFunction(component, 'component')

		// turn rendering back on after many renders have resolved
		setRenderLock(globalSpace, renderLock, true)

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

		const targetChild = target.firstElementChild

		/**
     * get the current working key (which will probably be null)
     * so that we can restore those branches after.
     * if an update was called while a mount was happening, this allows
     * us to not lose our place
     */
		const keyRestorePoint = copyWorkingKey(globalSpace, workingKeyName)
		resetWorkingKey(globalSpace, workingKeyName)

		/**
     * collect all the DOM events that we should be keeping track of.
     * these events are provided by belit and consumed by tatermorph.
     * (events are strange and actually aren't natively stored on Nodes,
     * but we have to keep track of them so we can know to add or
     * remove them between renders)
     */
		const getEvents = (newNode, oldNode) => {
			return [].concat(newNode.events).concat(oldNode.events)
		}

		// wipe the effectQueue
		clearEffectStore(globalSpace, effectQueue)

		// build the app locally, this may be called several times in a single update
		const app = component()

		// determine if we should render this app to the page (we render only the final build)
		const renderLockStore = getRenderLock(globalSpace, renderLock)
		const shouldRender = renderLockStore ? renderLockStore.shouldRender : true

		if (shouldRender) {
			// any future processing of component() for this mount will be rejected
			setRenderLock(globalSpace, renderLock, false)

			// update the target dom with the new app dom (this is done intelligently in the dom)
			morph(targetChild, app, getEvents)

			// get the effects that have already been processed
			const existingEffects = getEffectStore(globalSpace, effectStore) || {}

			// get the effects that are new
			const newEffects = getEffectStore(globalSpace, effectQueue) || {}

			// split out effects between existing, new and removed
			const existingEffectKeys = Object.keys(newEffects).filter(effect => (effect in existingEffects))
			const newEffectKeys = Object.keys(newEffects).filter(effect => !(effect in existingEffects))
			const removedEffectKeys = Object.keys(existingEffects).filter(effect => !(effect in newEffects))

			// run all clean up effects if the effect was removed and is a function
			removedEffectKeys
				.forEach(effectKey => {
					if (typeof existingEffects[effectKey] === 'function') {
						// call clean up effect
						existingEffects[effectKey]()
					}

					// remove effect from effectStore
					delete getEffectStore(globalSpace, effectStore)[effectKey]
				})

			// add any effects that should be in the store back in
			existingEffectKeys.forEach(effectKey => {
				getEffectStore(globalSpace, effectStore)[effectKey] = existingEffects[effectKey]
			})

			/**
       * run all new effects that we haven't seen before
       * save any cleanup effects in the effectStore
       */
			newEffectKeys.forEach(effectKey => {
				getEffectStore(globalSpace, effectStore)[effectKey] = newEffects[effectKey]()
			})
		}

		// if we used any working keys for hooks, clear them out now
		restoreWorkingKey(globalSpace, workingKeyName, keyRestorePoint)
	}
}

module.exports = {mount}
