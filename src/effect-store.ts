/*
 * EffectStores in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with useEffect to keep track of what
 * new effects should be triggered or cleaned up
 */

import { buildNamespace } from './namespace';

export const { setup: setupEffectStore, get: getEffectStore, set: setEffectStore } = buildNamespace(() => ({}));

/**
 * clear the effect store
 * usually called when we want to empty the effect store
 */
export const clearEffectStore = (effectName: string) => {
	const effectStore = getEffectStore(effectName);

	Object.keys(effectStore).forEach((key) => delete effectStore[key]);
};

/**
 * restore the effect store to a previous value
 * usually used when we had to interrupt the processing of effects
 */
export const restoreEffectStore = setEffectStore;
