const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_EFFECT_STORE, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { TRAM_TAG_EFFECTS } = require('../node-names')
const { getEffectStore, clearEffectStore, restoreEffectStore } = require('../effect-store')

// process the effects after triggering the tag function
const processEffects = (globalSpace, effectStore = TRAM_EFFECT_STORE, effectQueue = TRAM_EFFECT_QUEUE) => {
	return tagFunction => {
		// save the existing effect queue
		const existingQueuedEffects = getEffectStore(globalSpace, effectQueue)

		// clear the effect queue (so we can listen for just new effects)
		clearEffectStore(globalSpace, effectQueue)

		// create the component, which will save new effects to the effect queue
		const tagResult = tagFunction()

		// see if there are any brand new effects
		const existingEffects = getEffectStore(globalSpace, effectStore)
		const newEffects = getEffectStore(globalSpace, effectQueue)

		const newEffectKeys = Object.keys(newEffects).filter(effect => !(effect in existingEffects))
		newEffectKeys.forEach(effectKey => {
			// call effect and store cleanup in the effect store and node
			const effect = newEffects[effectKey]
			let cleanup
			const effectReaction = observe(() => {
				// if this effect has been made before, run the cleanup before starting again
				// if (cleanup) cleanup()

				// run the effect, the result is (most likely) a cleanup function
				cleanup = effect()
			})

			// make cleanup also remove effect from store and unobserve
			const cleanupAndRemove = () => {
				if (typeof cleanup === 'function') cleanup()
				unobserve(effectReaction)
				delete getEffectStore(globalSpace, effectStore)[effectKey]
			}

			getEffectStore(globalSpace, effectStore)[effectKey] = cleanupAndRemove
			if (!tagResult[TRAM_TAG_EFFECTS]) tagResult[TRAM_TAG_EFFECTS] = []
			tagResult[TRAM_TAG_EFFECTS].push(cleanupAndRemove)
		})

		// restore the effect queue to what it was before we started
		// in case we were in the middle of rendering another component
		restoreEffectStore(globalSpace, effectQueue, existingQueuedEffects)

		return tagResult
	}
}

module.exports = processEffects
