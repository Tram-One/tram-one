const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_EFFECT_STORE, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('../node-names')
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
		const queuedEffects = getEffectStore(globalSpace, effectQueue)

		const newEffects = Object.keys(queuedEffects).filter(effect => !(effect in existingEffects))
		tagResult[TRAM_TAG_NEW_EFFECTS] = newEffects.map(newEffectKey => queuedEffects[newEffectKey])

		// restore the effect queue to what it was before we started
		// in case we were in the middle of rendering another component
		restoreEffectStore(globalSpace, effectQueue, existingQueuedEffects)

		return tagResult
	}
}

module.exports = processEffects
