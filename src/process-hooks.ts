import { TRAM_EFFECT_STORE, TRAM_EFFECT_QUEUE, TRAM_KEY_QUEUE } from './engine-names';
import { TRAM_TAG_NEW_EFFECTS, TRAM_TAG_STORE_KEYS } from './node-names';
import { getEffectStore, clearEffectStore, restoreEffectStore } from './effect-store';
import { TramOneElement } from './types';
import { clearKeyQueue, getKeyQueue, restoreKeyQueue } from './key-queue';

/**
 * This is a helper function for the dom creation.
 * This function stores any keys generated when building a tag in the resulting node that is generated.
 *
 * These are later processed by the mutation-observer, and cleaned up when the node is removed by the mutation-observer.
 *
 * This function is called every time state changes in an observable store
 */
export default (tagFunction: () => TramOneElement) => {
	// save the existing effect queue and key queue for any components we are in the middle of building
	const existingQueuedEffects = { ...getEffectStore(TRAM_EFFECT_QUEUE) };
	const existingQueuedKeys = [...getKeyQueue(TRAM_KEY_QUEUE)];

	// clear the queues (so we can get just new effects and keys)
	clearEffectStore(TRAM_EFFECT_QUEUE);
	clearKeyQueue(TRAM_KEY_QUEUE);

	// create the component, which will save new effects to the effect queue
	const tagResult = tagFunction();

	// see if there are any brand new effects
	const existingEffects = getEffectStore(TRAM_EFFECT_STORE);
	const queuedEffects = getEffectStore(TRAM_EFFECT_QUEUE);

	// pull new effects that have yet to be processed from the tag
	// these can appear when a component re-exposes another component at its root
	const existingNewEffects = tagResult[TRAM_TAG_NEW_EFFECTS] || [];

	// store new effects (and the existing new effects) in the node we just built
	const newEffects = Object.keys(queuedEffects).filter((effect) => !(effect in existingEffects));
	const newEffectFunctions = newEffects.map((newEffectKey) => queuedEffects[newEffectKey]);
	const existingNewAndBrandNewEffects = existingNewEffects.concat(newEffectFunctions);
	tagResult[TRAM_TAG_NEW_EFFECTS] = existingNewAndBrandNewEffects;

	// same as the existingNewEffects, but for state values
	const existingNewKeys = tagResult[TRAM_TAG_STORE_KEYS] || [];

	// get all new keys
	const newKeys = getKeyQueue(TRAM_KEY_QUEUE);

	// store keys in the node we just built
	const existingNewAndBrandNewKeys = existingNewKeys.concat(newKeys);
	tagResult[TRAM_TAG_STORE_KEYS] = existingNewAndBrandNewKeys;

	// restore the effect and key queues to what they were before we started
	restoreEffectStore(TRAM_EFFECT_QUEUE, existingQueuedEffects);
	restoreKeyQueue(TRAM_KEY_QUEUE, existingQueuedKeys);

	return tagResult;
};
