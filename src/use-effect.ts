import { TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE } from './engine-names';
import { getEffectStore } from './effect-store';
import { getWorkingKeyValue, incrementWorkingKeyBranch } from './working-key';

import { Effect } from './types';

/**
 * @name useEffect
 * @link https://tram-one.io/#use-effect
 * @description
 * Hook that triggers component start, update, and cleanup effects.
 * If the return of effect is another function, then that function is called on when the component is removed.
 * If the effect is dependent on a observable, it will automatically trigger again if that value updates.
 *
 * @param effect function to run on component mount
 */
export default (effect: Effect): void => {
	// get the store of effects
	const effectQueue = getEffectStore(TRAM_EFFECT_QUEUE);

	// get the key value from working-key
	const key = getWorkingKeyValue(TRAM_HOOK_KEY);

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY);

	// append () so that it's easier to debug effects from components
	const callLikeKey = `${key}()`;

	// add the effect to the effect queue, so it can be processed later
	effectQueue[callLikeKey] = effect;
};
