const ensureFunction = require('type/function/ensure')

const { TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE } = require('./engine-names')
const { getEffectStore } = require('./effect-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('./working-key')

/**
 * @name useEffect
 * @memberof Tram-One
 * @public
 * @description
 * Hook that triggers component start, update, and cleanup effects.
 * If the return of effect is another function, then that function is called on when the component is removed.
 *
 * If the effect is dependent on a observable, it will automatically trigger again if that value updates.
 *
 * If `effect` does not return a function, the return is ignored, which means async functions are okay!
 *
 * Sandbox for simple useEffect
 * <iframe
 *	 src="https://codesandbox.io/embed/github/Tram-One/tram-one-samples/tree/use-effect-example-one/?autoresize=1&fontsize=14&hidenavigation=1&module=%2Findex.js&theme=dark"
 *	 style="width:100%; height:350px; border:0; border-radius: 4px; overflow:hidden;"
 * ></iframe>
 * @param {function} effect function to run on component mount
 */
module.exports = effect => {
	ensureFunction(effect, { errorMessage: `Tram-One: effect should be a function, recieved ${typeof effect}, ${effect}` })

	// get the store of effects
	const effectQueue = getEffectStore(TRAM_EFFECT_QUEUE)

	// get the key value from working-key
	const key = getWorkingKeyValue(TRAM_HOOK_KEY)

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// append () so that it's easier to debug effects from components
	const callLikeKey = `${key}()`

	// add the effect to the effect queue, so it can be processed later
	effectQueue[callLikeKey] = effect
}
