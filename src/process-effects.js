const { TRAM_EFFECT_STORE, TRAM_EFFECT_QUEUE } = require('./engine-names')
const { TRAM_TAG_NEW_EFFECTS } = require('./node-names')
const { getEffectStore, clearEffectStore, restoreEffectStore } = require('./effect-store')

/**
 * @private
 * @description
 * This is a helper function for the dom creation.
 * This function stores any effects generated when building a tag in resulting node that is generated.
 *
 * These are later processed by the mutation-observer, and cleaned up when the node is removed by the mutation-observer.
 */
module.exports = tagFunction => {
	// save the existing effect queue for any components we are in the middle of building
	const existingQueuedEffects = { ...getEffectStore(TRAM_EFFECT_QUEUE) }

	// clear the effect queue (so we can listen for just new effects)
	clearEffectStore(TRAM_EFFECT_QUEUE)

	// create the component, which will save new effects to the effect queue
	const tagResult = tagFunction()

	// see if there are any brand new effects
	const existingEffects = getEffectStore(TRAM_EFFECT_STORE)
	const queuedEffects = getEffectStore(TRAM_EFFECT_QUEUE)

	// store new effects in the node we just built
	const newEffects = Object.keys(queuedEffects).filter(effect => !(effect in existingEffects))
	tagResult[TRAM_TAG_NEW_EFFECTS] = newEffects.map(newEffectKey => queuedEffects[newEffectKey])

	// restore the effect queue to what it was before we started
	restoreEffectStore(TRAM_EFFECT_QUEUE, existingQueuedEffects)

	return tagResult
}
